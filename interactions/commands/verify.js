const { EmbedBuilder, codeBlock, ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, ButtonStyle } = require('discord.js');
const { classes, verifyChannelId } = require('../../config.json');

module.exports = {
    id: 'command:verify',
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Permet d\'avoir accès au serveur')
        .addStringOption(option => 
            option
                .setName('prénom')
                .setDescription('Ton PRÉNOM')
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName('nom')
                .setDescription('Ton NOM')
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName('classe')
                .setDescription('Ta classe')
                .setChoices(...classes)
                .setRequired(true)
        )
        .setDMPermission(false),
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });

        const nom = interaction.options.getString('nom').toUpperCase();
        const prenom = interaction.options.getString('prénom');
        const classe = interaction.options.getString('classe');

        const displayedDatas =
`
nom: ${nom}
prenom: ${prenom}
classe: ${classe}
`;

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setColor(0x00ff00)
            .setTitle('Demande de vérification')
            .setDescription(codeBlock('yaml', displayedDatas))
            .setTimestamp();

        const buttonsParams = new URLSearchParams({
            userId: interaction.user.id,
            nom, prenom, classe
        }).toString();

        if(buttonsParams.length > 75) return interaction.editReply('Les informations que tu as entrées sont trop longue, tu devrais envoyer un message à un fondateur.\nDésolé pour la gêne occasionnée !');

        const acceptButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setCustomId(`button:accept?${buttonsParams}`)
            .setLabel('Accepter');
        
        const refuseButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`button:refuse?${buttonsParams}`)
            .setLabel('Refuser');

        const firstActionRow = new ActionRowBuilder()
            .setComponents(acceptButton, refuseButton);

        const makeUrlFriendly = value => encodeURIComponent(value.replaceAll(' ', '+'));
        const urlFriendlyFirstName = makeUrlFriendly(prenom);
        const urlFriendlyLastName = makeUrlFriendly(nom);
        const officeVerifyURL = `https://www.office.com/search/people?q=${urlFriendlyLastName}+${urlFriendlyFirstName}`;

        const verifyLinkButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(officeVerifyURL)
            .setLabel('Vérifier sur Office');

        const secondActionRow = new ActionRowBuilder()
            .setComponents(verifyLinkButton);

        const verifyChannel = interaction.guild.channels.cache.get(verifyChannelId);
        
        let content = '';
        try {
            await verifyChannel.send({
                embeds: [ embed ],
                ephemeral: true,
                components: [
                    firstActionRow,
                    secondActionRow
                ]
            });

            content = 'Votre demande à été envoyée avec succès, quelqu\'un la vérifiera sous peu.'
        } catch(error) {
            console.error(error);
            content = 'Désolé, une erreur est survenue. Merci de bien vouloir réessayer, ou envoyer un message à un fondateur.'
        } finally {
            await interaction.editReply({
                content,
                ephemeral: true
            });
        }
    }
}