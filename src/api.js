import { faker } from '@faker-js/faker'

export async function* fetchAnnouncements() {
    for(let i = 0; i < 10000; i++) {
        
        // simulate delay
        await new Promise(r => setTimeout(r, 100))

        yield {
            author: `${faker.person.firstName()} ${faker.person.lastName()}`,
            date: faker.date.past(),
            body: `
# ${faker.lorem.sentence()}
${faker.lorem.paragraph()}
[${faker.lorem.sentence()}](${faker.internet.url()})
`
        }
    }
}