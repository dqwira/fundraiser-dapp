const FundraiserContract = artifacts.require('Fundraiser')

contract('Fundraiser', accounts => {
	let fundraiser
	const name = 'Test Fundraiser Name'
	const description = 'My test fundriaser description'
	const url = 'testfundraiser.org'
	const imageURL = 'https://placekitten.com/600/350'
	const beneficiary = accounts[1]
	const owner = accounts[0]

	beforeEach(async () => {
		fundraiser = await FundraiserContract.new(name, description, url, imageURL, beneficiary, owner)
	})

	describe('initialization', () => {
		it('gets the beneficiary name', async () => {
			const actual = await fundraiser.name()
			assert.equal(actual, name, 'names should match')
		})

		it('gets the beneficiary description', async () => {
			const actual = await fundraiser.description()
			assert.equal(actual, description, 'description should match')
		})

		it('gets the beneficiary website URL', async () => {
			const actual = await fundraiser.url()
			assert.equal(actual, url, 'url should match')
		})

		it('gets the beneficiary image URL', async () => {
			const actual = await fundraiser.imageURL()
			assert.equal(actual, imageURL, 'imageURL should match')
		})

		it('gets the beneficiary', async () => {
			const actual = await fundraiser.beneficiary()
			assert.equal(actual, beneficiary, 'beneficiary address should match')
		})

		it('gets the owner', async () => {
			const actual = await fundraiser.owner()
			assert.equal(actual, owner, 'custodian address should match')
		})
	})

	describe('setBeneficiary(address)', () => {
		const newBeneficiary = accounts[2]

		it('updates beneficiary when called by owner account', async () => {
			await fundraiser.setBeneficiary(newBeneficiary, { from: owner })
			const actualBeneficiary = await fundraiser.beneficiary()
			assert.equal(actualBeneficiary, newBeneficiary, 'beneficiaries should match')
		})

		it('throws an error when called from a non-owner account', async () => {
			try {
				await fundraiser.setBeneficiary(newBeneficiary, { from: accounts[3] })
				assert.fail('withdraw was not restricted to owners')
			} catch (err) {
				const expectedError = 'Ownable: caller is not the owner'
				const actualError = err.reason
				assert.equal(actualError, expectedError, 'should not be permitted')
			}
		})
	})

	describe('updateDetails(name, description, websiteURL, imageURL)', () => {
		const newName = 'New Fundraiser Name'
		const newDescription = 'This is my new fundraiser description.'
		const newUrl = 'newfundraisername.org'
		const newImageURL = 'https://picsum.photos/600/350'

		it('updates the fundraiser details when called by owner account', async () => {
			await fundraiser.updateDetails(newName, newDescription, newUrl, newImageURL, { from: owner })
			const actualName = await fundraiser.name()
			const actualDescription = await fundraiser.description()
			const actualUrl = await fundraiser.url()
			const actualImageURL = await fundraiser.imageURL()
			assert.equal(actualName, newName, 'names should match')
			assert.equal(actualDescription, newDescription, 'descriptions should match')
			assert.equal(actualUrl, newUrl, 'URLs should match')
			assert.equal(actualImageURL, newImageURL, 'image URLs should match')
		})

		it('throws an error when called from a non-owner account', async () => {
			try {
				await fundraiser.updateDetails(newName, newUrl, newImageURL, newDescription, {
					from: accounts[3],
				})
				assert.fail('updating details was not restricted to owners')
			} catch (err) {
				const expectedError = 'Ownable: caller is not the owner'
				const actualError = err.reason
				assert.equal(actualError, expectedError, 'should not be permitted')
			}
		})

		it('emits the DetailsUpdated event', async () => {
			const tx = await fundraiser.updateDetails(newName, newDescription, newUrl, newImageURL, {
				from: owner,
			})
			const expectedEvent = 'DetailsUpdated'
			const actualEvent = tx.logs[0].event
			assert.equal(actualEvent, expectedEvent, 'events should match')
		})
	})

	describe('making donations', () => {
		const value = web3.utils.toWei('0.0289')
		const donor = accounts[2]

		it('increases myDonationsCount', async () => {
			const currentDonationsCount = await fundraiser.myDonationsCount({ from: donor })
			await fundraiser.donate({ from: donor, value })
			const newDonationsCount = await fundraiser.myDonationsCount({ from: donor })
			assert.equal(
				1,
				newDonationsCount - currentDonationsCount,
				'myDonationsCount should increment by 1',
			)
		})

		it('includes donation in myDonations', async () => {
			await fundraiser.donate({ from: donor, value })
			const { values, dates } = await fundraiser.myDonations({ from: donor })
			assert.equal(value, values[0], 'values should match')
			assert(dates[0], 'date should be present')
		})

		it('increases the totalDonations amount', async () => {
			const currentTotal = await fundraiser.totalDonations()
			await fundraiser.donate({ from: donor, value })
			const newTotal = await fundraiser.totalDonations()
			const diff = newTotal - currentTotal
			assert.equal(diff, value, 'difference should match the donation value')
		})

		it('increases donationsCount', async () => {
			const currentCount = await fundraiser.donationsCount()
			await fundraiser.donate({ from: donor, value })
			const newCount = await fundraiser.donationsCount()
			assert.equal(newCount - currentCount, 1, 'donationsCount should increment by 1')
		})

		it('emits the DonationsReceived event', async () => {
			const tx = await fundraiser.donate({ from: donor, value })
			const expectedEvent = 'DonationReceived'
			const actualEvent = tx.logs[0].event
			assert.equal(actualEvent, expectedEvent, 'events should match')
		})
	})

	describe('withdrawing funds', () => {
		beforeEach(async () => {
			await fundraiser.donate({ from: accounts[2], value: web3.utils.toWei('0.1') })
		})

		describe('access controls', () => {
			it('throws an error when called from a non-owner account', async () => {
				try {
					await fundraiser.withdraw({ from: accounts[3] })
					assert.fail('withdraw was not restricted to owners')
				} catch (err) {
					const expectedError = 'Ownable: caller is not the owner'
					const actualError = err.reason
					assert.equal(actualError, expectedError, 'should not be permitted')
				}
			})

			it('permits the owner to call the function', async () => {
				try {
					await fundraiser.withdraw({ from: owner })
					assert(true, 'no errors were thrown')
				} catch (err) {
					assert.fail('should not have thrown an error')
				}
			})
		})

		it('transfers balance to beneficiary', async () => {
			const currentContractBalance = await web3.eth.getBalance(fundraiser.address)
			const currentBeneficiaryBalance = await web3.eth.getBalance(beneficiary)

			await fundraiser.withdraw({ from: owner })

			const newContractBalance = await web3.eth.getBalance(fundraiser.address)
			const newBeneficiaryBalance = await web3.eth.getBalance(beneficiary)
			const beneficiaryDiff = newBeneficiaryBalance - currentBeneficiaryBalance

			assert.equal(newContractBalance, 0, 'contract should have a 0 balance')
			assert.equal(beneficiaryDiff, currentContractBalance, 'beneficiary should receive all funds')
		})

		it('emits Withdraw event', async () => {
			const tx = await fundraiser.withdraw({ from: owner })
			const expectedEvent = 'Withdraw'
			const actualEvent = tx.logs[0].event
			assert.equal(actualEvent, expectedEvent, 'events should match')
		})
	})

	describe('fallback function', () => {
		const value = web3.utils.toWei('0.0289')

		it('increases the totalDonations amount', async () => {
			const currentTotal = await fundraiser.totalDonations()

			// invoke the fallback function with sendTransaction() method
			await web3.eth.sendTransaction({ to: fundraiser.address, from: accounts[9], value })

			const newTotal = await fundraiser.totalDonations()
			const diff = newTotal - currentTotal
			assert.equal(diff, value, 'difference should match the donation value')
		})

		it('increases donationsCount', async () => {
			const currentCount = await fundraiser.donationsCount()

			// invoke the fallback function with sendTransaction() method
			await web3.eth.sendTransaction({ to: fundraiser.address, from: accounts[9], value })

			const newCount = await fundraiser.donationsCount()
			assert.equal(newCount - currentCount, 1, 'donationsCount should increment by 1')
		})
	})

	describe('receive function', () => {
		const value = web3.utils.toWei('0.0289')

		it('increases the totalDonations amount', async () => {
			const currentTotal = await fundraiser.totalDonations()

			// invoke the fallback function with sendTransaction() method
			await web3.eth.sendTransaction({ to: fundraiser.address, from: accounts[9], value })

			const newTotal = await fundraiser.totalDonations()
			const diff = newTotal - currentTotal
			assert.equal(diff, value, 'difference should match the donation value')
		})

		it('increases donationsCount', async () => {
			const currentCount = await fundraiser.donationsCount()

			// invoke the fallback function with sendTransaction() method
			await web3.eth.sendTransaction({ to: fundraiser.address, from: accounts[9], value })

			const newCount = await fundraiser.donationsCount()
			assert.equal(newCount - currentCount, 1, 'donationsCount should increment by 1')
		})
	})
})
