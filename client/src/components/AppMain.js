import { Container } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import Explore from './Explore'
import FundraisersDetails from './FundraiserDetails'
import Home from './Home'
import NewFundraiser from './NewFundraiser'
import Receipts from './Receipts'

const AppMain = () => (
	<main className="main-container">
		<Routes>
			<Route
				path="/"
				exact
				element={
					<Container maxWidth="xl">
						<Home />
					</Container>
				}
			/>
			<Route
				path="/explore"
				exact
				element={
					<Container maxWidth="xl">
						<Explore />
					</Container>
				}
			/>
			<Route
				path="new"
				element={
					<Container maxWidth="md">
						<NewFundraiser />
					</Container>
				}
			/>
			<Route
				path="receipts"
				element={
					<Container maxWidth="md">
						<Receipts />
					</Container>
				}
			/>
			<Route
				path="fund/:id"
				element={
					<Container maxWidth="xl">
						<FundraisersDetails />
					</Container>
				}
			/>
		</Routes>
	</main>
)

export default AppMain
