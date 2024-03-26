

export const newProConSystemMessage = (currentArgumentMap?: string) => {

    const example = `BEGIN EXAMPLE:
        pros: [
            'It is a violation of human rights to take a person\'s life, regardless of their actions.',
            'There is a risk of executing innocent individuals.',
            'The death penalty is disproportionately applied to minorities and those from disadvantaged backgrounds.',
        ],
            cons: [
            'The death penalty serves as a deterrent to potential criminals.',
            'It provides closure to victims\' families and a sense of justice.',
            'Some crimes are so heinous that they warrant the ultimate punishment.',
        ]
        END EXAMPLE`


    return `Generate an argument map (only text, not a list).  Max 3 Pro and Cons each.  Like this example;
  
    ${example}
  
    ${currentArgumentMap 
        ? `Here is the current argument map, do not re-use claims: ${currentArgumentMap}` 
        : ''}

    Starting Claim:`;
}