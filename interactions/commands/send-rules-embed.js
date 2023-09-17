const { EmbedBuilder, codeBlock, ButtonBuilder, ActionRowBuilder, roleMention, channelMention } = require('@discordjs/builders');
const { SlashCommandBuilder, ButtonStyle, Embed } = require('discord.js');
const { classes, verifyChannelId, founderRoleId } = require('../../config.json');

module.exports = {
    id: 'command:send-rules-embed',
    data: new SlashCommandBuilder()
        .setName('send-rules-embed')
        .setDescription('Envoie le message du règlement du serveur dans le salon spécifié')
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
            .setTitle('Règlement du serveur')
            .setDescription('Bienvenue ! Afin de préserver une ambiance chill et de ne pas avoir de problèmes, voici un règlement. Il est assez court, parce que les longs réglements juste pour écrire des règles, ça sert à rien. c:')
            .addFields(
                {
                    name: 'Préambule',
                    value: 'Merci de respecter les [ToS / Conditions d\'Utilisation de discord](https://discord.com/terms). On est sur Discord après tout !'
                },
                {
                    name: 'Règles',
                    value: `
1. Ce serveur est privé et réservé aux élèves du lycée LaSalle Saint-Denis **à partir de la Seconde**, *sauf exceptions désignées par les fondateurs*. Pour s'assurer que cette règle est respectée, un salon de ${channelMention('1147682254336823406')} est présent. Merci de passer par ce salon après avoir lu le règlement pour avoir accès au serveur.
2. Veuillez ne pas usurper l'identité des autres. Toute usurpation d'identité sera dénoncée à la vie scolaire.
3. Merci de communiquer dans le respect avec les autres.`
                }
            )
            .setThumbnail(interaction.guild.iconURL());

        try {
            /** @type {import('discord.js').Channel} */
            const channel = interaction.options.getChannel('channel');

            if(!channel.send) return interaction.reply({ content: 'Je ne peux pas envoyer de message dans ce salon.', ephemeral: true });

            await channel.send({ embeds: [embed] });
            await interaction.reply(`Le message des règles du serveur a bien été envoyé dans ${channel}.`)
        } catch(error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true });
        } 
    }
}