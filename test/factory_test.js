const FactoryContract = artifacts.require('Factory')
const FundraiserContract = artifacts.require('Fundraiser')

contract('Factory: deployment', () => {
	it('has been deployed', () => {
		const Factory = FactoryContract.deployed()
		assert(Factory, 'fundraiser factory was not deployed')
	})
})

contract('Factory: createFundraiser', accounts => {
	let Factory
	// fundraiser args
	const name = 'Beneficiary Name'
	const url = 'beneficiaryname.org'
	const imageURL = 'https://placekitten.com/600/350'
	const desc = 'Beneficiary description'
	const beneficiary = accounts[1]

	it('increments the fundraisersCount', async () => {
		Factory = await FactoryContract.deployed()
		const currentCount = await Factory.fundraisersCount()
		await Factory.createFundraiser(name, desc, url, imageURL, beneficiary)
		const newCount = await Factory.fundraisersCount()
		assert.equal(newCount - currentCount, 1, 'should increment by 1')
	})

	it('emits the FundraiserCreated event', async () => {
		Factory = await FactoryContract.deployed()
		const tx = await Factory.createFundraiser(name, desc, url, imageURL, beneficiary)
		const expectedEvent = 'FundraiserCreated'
		const actualEvent = tx.logs[0].event
		assert.equal(actualEvent, expectedEvent, 'events should match')
	})
})

contract('Factory: fundraisers', accounts => {
	async function createFactory(fundraisersCount, accounts) {
		const factory = await FactoryContract.new()
		await addFundraisers(factory, fundraisersCount, accounts)
		return factory
	}

	async function addFundraisers(factory, count, accounts) {
		const name = 'Beneficiary'
		const lowerCaseName = name.toLowerCase()
		const beneficiary = accounts[1]
		// Create a series of fundraisers. The index will be used to make them each unique
		for (let i = 0; i < count; i++) {
			await factory.createFundraiser(
				`${name} ${i}`,
				`Description for ${name} ${i}`,
				`${lowerCaseName}${i}.com`,
				`${lowerCaseName}${i}.com`,
				beneficiary,
			)
		}
	}

	describe('when fundraisers collection is empty', () => {
		it('returns an empty collection', async () => {
			const factory = await createFactory(0, accounts)
			const fundraisers = await factory.fundraisers(10, 0)
			assert.equal(fundraisers, 0, 'collection should be empty')
		})
	})

	describe('varying limits', () => {
		let factory
		beforeEach(async () => {
			factory = await createFactory(30, accounts)
		})

		it('returns 10 results when limit requested is 10', async () => {
			const fundraisers = await factory.fundraisers(10, 0)
			assert.equal(fundraisers.length, 10, 'results size should be 10')
		})

		it('returns 20 results when limit requested is 20', async () => {
			const fundraisers = await factory.fundraisers(20, 0)
			assert.equal(fundraisers.length, 20, 'results size should be 20')
		})

		it('returns 20 results when limit requested is 30', async () => {
			const fundraisers = await factory.fundraisers(30, 0)
			assert.equal(fundraisers.length, 20, 'results size should be 20')
		})
	})

	describe('varying offset', () => {
		let factory
		beforeEach(async () => {
			factory = await createFactory(10, accounts)
		})

		it('contains the fundraiser with the appropriate offset', async () => {
			const fundraisers = await factory.fundraisers(1, 0)
			const fundraiser = await FundraiserContract.at(fundraisers[0])
			const name = await fundraiser.name()
			assert.ok(await name.includes(0), `${name} did not include the offset`)
		})

		it('contains the fundraiser with the appropriate offset', async () => {
			const fundraisers = await factory.fundraisers(1, 7)
			const fundraiser = await FundraiserContract.at(fundraisers[0])
			const name = await fundraiser.name()
			assert.ok(await name.includes(7), `${name} did not include the offset`)
		})
	})

	describe('boundary conditions', () => {
		let factory
		beforeEach(async () => {
			factory = await createFactory(10, accounts)
		})

		it('raises out of bounds error', async () => {
			try {
				await factory.fundraisers(1, 11)
				assert.fail('error was not raised')
			} catch (err) {
				const expected = 'offset out of bounds'
				assert.ok(err.message.includes(expected), `${err.message}`)
			}
		})

		it('adjusts return size to prevent out of bounds error', async () => {
			try {
				const fundraisers = await factory.fundraisers(10, 5)
				assert.equal(fundraisers.length, 5, 'collection adjusted')
			} catch (err) {
				assert.fail('limit and offset exceeded bounds')
			}
		})
	})
})
