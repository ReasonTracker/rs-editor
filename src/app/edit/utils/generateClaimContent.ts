import { faker } from '@faker-js/faker';

export default function generateSimpleAnimalClaim() {
    const claim = `${faker.animal.type()}s are ${faker.commerce.productAdjective()} and ${faker.commerce.productAdjective()}.`;
    return claim;
}