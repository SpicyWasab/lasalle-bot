const { EmbedBuilder, codeBlock, ButtonBuilder, ActionRowBuilder, userMention, inlineCode } = require('@discordjs/builders');
const { SlashCommandBuilder, ButtonStyle, ChatInputCommandInteraction, ButtonInteraction } = require('discord.js');

module.exports = {
    id: 'button:refuse',
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {URLSearchParams} params 
     */
    async execute(interaction, params) {
        await interaction.deferUpdate();

        const { userId, classe, nom, prenom } = Object.fromEntries(params.entries());
        
        let isDMSuccess = true;
        try {
            const member = await interaction.guild.members.fetch(userId);
            await member.send('Hey ! Malheureusement ta demande de vérification a été refusée. Si tu penses que c\'est une erreur, tu peux la réitérer.');
        } catch(error) {
            console.error(error);
            isDMSuccess = false;    
        } finally {
            const identity = `${classe} ~ ${prenom} ${nom}`;
            let content = `⛔ – ${userMention(userId)} a été refusé du serveur (identité proposée: ${inlineCode(identity)}).\n`;
            
            if(!isDMSuccess) content += '⚠️ – Je n\'ai pas réussi à MP cette personne, elle n\'a donc pas été mise au courant de cette décision.';

            await interaction.editReply({
                content,
                embeds: [],
                components: []
            });
        }

    }
}