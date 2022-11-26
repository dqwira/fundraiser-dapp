import PropTypes from 'prop-types'
import { createContext, useContext, useEffect, useState } from 'react'
import FactoryContract from '../contracts/Factory.json'
import getWeb3 from '../utils/getWeb3'
import FullPageLoading from './FullPageLoading'
import Web3Fallback from './Web3Fallback'

const Web3Context = createContext()

export const Web3Provider = ({ children }) => {
	const [web3, setWeb3] = useState(null)
	const [accounts, setAccounts] = useState(null)
	const [factory, setFactory] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		loadWeb3()
	}, [])

	const loadWeb3 = async () => {
		try {
			// Get network provider and web3 instance
			const web3Instance = await getWeb3()
			setWeb3(web3Instance)

			// Get accounts initially
			const connectedAccounts = await web3Instance.eth.getAccounts()
			setAccounts(connectedAccounts)

			// Get the Factory contract instance
			const networkId = await web3Instance.eth.net.getId()
			const deployedNetwork = FactoryContract.networks[networkId]
			const factoryContract = new web3Instance.eth.Contract(
				FactoryContract.abi,
				deployedNetwork && deployedNetwork.address,
			)
			setFactory(factoryContract)

			// Listen for account changes
			// TODO: if (web3Instance.currentProvider.isMetaMask) ?
			web3Instance.currentProvider.on('accountsChanged', async newAccounts => {
				console.info('Switching wallet accounts')
				setAccounts(newAccounts)
			})

			// Listen for chain changes
			web3Instance.currentProvider.on('chainChanged', chainId => {
				console.info(`Switching wallet networks: Network ID ${chainId} is supported`)
				// Correctly handling chain changes can be complicated
				// Reload the page as simple solution
				window.location.reload()
			})

			setLoading(false)
		} catch (error) {
			// Catch any errors for any of the above operations.
			setError('Failed to load web3, accounts, or factory contract. Check console for details.')
			console.error(error)
			setLoading(false)
		}
	}

	// if (!web3 || !accounts) return <div>No web3 or accounts</div>
	if (loading) return <FullPageLoading />
	if (error) return <Web3Fallback />

	return <Web3Context.Provider value={{ web3, accounts, factory }}>{children}</Web3Context.Provider>
}

Web3Provider.propTypes = {
	children: PropTypes.node.isRequired,
}

export const useWeb3 = () => {
	const context = useContext(Web3Context)
	if (context === undefined) {
		throw new Error('useWeb3 must be used within an Web3Provider component.')
	}
	return context
}

export default Web3Context
