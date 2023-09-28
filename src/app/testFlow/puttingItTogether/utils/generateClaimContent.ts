import { faker } from '@faker-js/faker';

export default function generateSimpleAnimalClaim() {
    // Generate a claim using an animal type and a positive adjective
    const claim = `${faker.animal.type()}s are ${faker.commerce.productAdjective()} and ${faker.commerce.productAdjective()}.`;
    return claim;
}