const { EmbedBuilder, codeBlock, ButtonBuilder, ActionRowBuilder, userMention } = require('@discordjs/builders');
const { SlashCommandBuilder, ButtonStyle, ChatInputCommandInteraction, ButtonInteraction } = require('discord.js');
const { passRoleId, rolesNiveauId } = require('../../config.json');

module.exports = {
    id: 'button:accept',
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {URLSearchParams} params 
     */
    async execute(interaction, params) {
        await interaction.deferUpdate();

        const { userId, classe, nom, prenom } = Object.fromEntries(params.entries());
        
        try {
            const member = await interaction.guild.members.fetch(userId);
            let newNickname = `${classe} ~ ${prenom} ${nom}`;
            if(newNickname.length > 32) newNickname = newNickname.substring(0, 31) + '…';

            console.log(params.entries());

            const niveauCode = classe.at(0);

            const niveauRoleId = rolesNiveauId[niveauCode];

            await Promise.all([
                member.roles.add([ passRoleId, niveauRoleId ]),
                member.setNickname(newNickname)
            ]);
        } catch(error) {
            console.error(error);
            return await interaction.followUp('Une erreur est survenue en tentant d\'accepter cette personne.');    
        }

        await interaction.editReply({
            content: `✅ – ${userMention(userId)} a été accepté sur le serveur.`,
            embeds: [],
            components: []
        });
    }
}