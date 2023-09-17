const { EmbedBuilder, codeBlock, ButtonBuilder, ActionRowBuilder, roleMention } = require('@discordjs/builders');
const { SlashCommandBuilder, ButtonStyle, Embed } = require('discord.js');
const { classes, verifyChannelId, founderRoleId } = require('../../config.json');

module.exports = {
    id: 'command:send-verify-embed',
    data: new SlashCommandBuilder()
        .setName('send-verify-embed')
        .setDescription('Envoie le message d\'explication du système de vérification dans le salon spécifié')
        .addChannelOption(option => 
            option
                .setName('channel')
                .setDescription('Le channel dans lequel envoyer le message explicatif')    
                .setRequired(true)
        )
        .setDMPermission(false),
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        if(!interaction.member.roles.cache.has(founderRoleId)) return interaction.reply({ content: 'Tu ne devrais pas avoir accès à cette commande.', ephemeral: true });

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('Vérification')
            .setDescription('Bienvenue sur le discord LaSalle Saint-Denis !\nAfin de s\'assurer que tu n\'es pas un parfait inconnu, nous avons besoin d\'effectuer une simple vérification avant de te donner accès au serveur.')
            .addFields(
                {
                    name: 'Comment me vérifier ?',
                    value: 'Tu n\'as qu\'à effectuer la commande </verify:1147892419199774730> c:'
                },
                {
                    name: 'La commande ne marche pas / il manque ma classe',
                    value: `Mince ... Envoie un message à l\'un des ${roleMention(founderRoleId)} avec ton prénom, ton nom et ta classe :)\nDésolé pour la gêne occasionnée ^^'`
                }
            )
            .setThumbnail(interaction.guild.iconURL());

        try {
            /** @type {import('discord.js').Channel} */
            const channel = interaction.options.getChannel('channel');

            if(!channel.send) return interaction.reply({ content: 'Je ne peux pas envoyer de message dans ce salon.', ephemeral: true });

            await channel.send({ embeds: [embed] });
            await interaction.reply(`Le message d'explication du système de vérification a bien été envoyé dans ${channel}.`)
        } catch(error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true });
        } 
    }
}