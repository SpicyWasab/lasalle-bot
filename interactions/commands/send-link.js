const { EmbedBuilder, codeBlock, ButtonBuilder, ActionRowBuilder, roleMention, quote, inlineCode } = require('@discordjs/builders');
const { SlashCommandBuilder, ButtonStyle, Embed, Colors } = require('discord.js');
const { classes, verifyChannelId, founderRoleId } = require('../../config.json');

module.exports = {
    id: 'command:send-link',
    data: new SlashCommandBuilder()
        .setName('send-link')
        .setDescription('Envoie un lien dans un joli petit embed, dans le salon actuel')
        .addStringOption(option => 
            option
                .setName('link')
                .setDescription('Le lien à envoyer')    
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName('title')
                .setDescription('Un titre court et concis pour lien')    
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName('description')
                .setDescription('Une description optionnelle du lien')    
                .setRequired(false)
        )
        .setDMPermission(false),
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        if(!interaction.member.roles.cache.has(founderRoleId)) return await interaction.reply({ content: 'Tu ne devrais pas avoir accès à cette commande.', ephemeral: true });

        const link = interaction.options.getString('link');
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');

        if(!link.startsWith('http')) return await interaction.reply({ content: `Le lien doit commencer par ${inlineCode('http(s)://')}.`, ephemeral: true });

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(title)
            .setDescription(quote(link) + '\n' + (description ?? ''))
        
        const followLinkButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Ouvrir le lien')
            .setURL(link);
        
        const actionRow = new ActionRowBuilder()
            .setComponents(followLinkButton);

        try {
            /** @type {import('discord.js').Channel} */
            const channel = interaction.channel;

            await channel.send({ embeds: [embed], components: [ actionRow ] });
            await interaction.reply({ content: 'Le lien a bien été envoyé.', ephemeral: true });
        } catch(error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true });
        } 
    }
}