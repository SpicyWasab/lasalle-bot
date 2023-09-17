module.exports = {
    type: 'interactionCreate',
    /**
     * 
     * @param {import("discord.js").Interaction} interaction 
     */
    async callback(interaction) {
        const { client } = interaction;

        if(interaction.isAutocomplete) console.log(interaction);

        let execute;
        let params;

        if(interaction.isChatInputCommand()) {
            const { commandName } = interaction;

            execute = client.interactions.get(`command:${commandName}`);
        } else if(interaction.isAutocomplete()) {
            const { commandName } = interaction;
            const optionName = interaction.options.data.find(o => o.focused).name;

            console.log(interaction.version)

            execute = client.interactions.get(`autocomplete:${optionName}`);
        } else if(interaction.isStringSelectMenu()) {
            const { customId } = interaction;

            execute = client.interactions.get(customId);
        } else if(interaction.isButton()) {
            const { customId } = interaction;

            const [ id, paramsString ] = customId.split('?');
            params = new URLSearchParams(paramsString);

            execute = client.interactions.get(id);
        }

        try {
            await execute(interaction, params);
        } catch(error) {
            console.error(`Une erreur est survenue (commande : ${interaction?.commandName} ; customId : ${interaction?.customId})`);
            console.error(error);
        }
    }
}