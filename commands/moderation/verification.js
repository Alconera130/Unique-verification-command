const { MessageEmbed, MessageActionRow, MessageButton, Formatters } = require('discord.js')

module.exports = {
    name: "verification",
    aliases: ['ver'],
    run: async (client, message, args) => {
        const author = await message.author
        let content = args.join(' ')
        
        const { get, /*set,*/ argCheck } = client.func
        
        const usertag = `${author.username}#${author.discriminator}`
        
        let chance = client.chance.bool({ likelihood: 0.001 })
        if (chance) chance = 'FFBAF0'; else chance = 'BLUE'

        if (!content) {
            const embed = new MessageEmbed()
                .setAuthor(
                    usertag,
                    author.displayAvatarURL({
                        size: 2048,
                        dynamic: true
                    })
                )
                .setTitle('Verification options')
                .addFields(
                    { name: "Set", value: `Set a verification measure using this command\n> \`verification set <channel | role> <[role ID 1 [|] role ID 2] [|] [channel ID or name]>\``, inline: true },
                    { name: "Verify", value: `Verify yourself for the server`, inline: true }
                )
                .setColor(chance)
            
            return message.channel.send({
                embeds: [embed]
            })
		} else {
            if (argCheck(content, 1).toLowerCase() === 'set') {
                const perms = ['MANAGE_ROLES', 'MANAGE_CHANNELS']

                if (perms.every(p => message.member.permissions.has(p))) {
                    if (!argCheck(content, 2)) {
                        const embed = new MessageEmbed()
                            .setAuthor(
                                usertag,
                                author.displayAvatarURL({
                                    size: 2048,
                                    dynamic: true
                                })
                            )
                            .setTitle('Verification options: Set')
                            .setDescription(`Set a verification measure for your server. Examples:\n\nFor channels:\n${Formatters.codeBlock('js', 'verification set channel <#852052322045001740>')}\n\nFor roles:\n${Formatters.codeBlock('js', 'verification set role <@&887905491336974357>')}\nOr with optional field:\n${Formatters.codeBlock('js', 'verification set role <@&887905491336974357> <@&867389671977123911>')}`)
                            .setColor(chance)
                        
                        return message.channel.send({
                            embeds: [
                                embed
                            ]
                        })
                    } else { //verification set(1) channel or role(2) channel name id or role name id(3)
                        if (argCheck(content, 2).toLowerCase() === 'channel') {
                            if (!argCheck(content, 3)) {
                                const embed = new MessageEmbed()
                                    .setAuthor(
                                        usertag,
                                        author.displayAvatarURL({
                                            size: 2048,
                                            dynamic: true
                                        })
                                    )
                                    .setTitle('Verification set class: Channel')
                                    .setDescription(`Set a verification channel for your server\n\nExamples:\n${Formatters.codeBlock('js', 'verification set channel <#852052322045001740>')}`)
                                    .setColor(chance)
    
                                return message.channel.send({
                                    embeds: [
                                        embed
                                    ]
                                })
                            } else {
                                const option = argCheck(content, 3)
                                const manager = message?.guild?.channels?.cache
    
                                let channel = manager?.get(option) || manager?.find(c => c?.name === option?.toLowerCase() || c?.name?.toLowerCase()?.endsWith(option?.toLowerCase()) || c?.name?.toLowerCase()?.startsWith(option?.toLowerCase) || c?.name?.includes(option?.toLowerCase())) || message?.mentions?.channels?.first()
                                channel = channel?.id
                            
                                if (!channel) {
                                    return message.channel.send({
                                        content: `The channel \`${option}\` doesnt exist in this server`
                                    })
                                } else {
                                    await client.db.set('database', `verification_channel_${message.guild.id}`, channel)
                                
                                    const embed = new MessageEmbed()
                                        .setAuthor(
                                            usertag,
                                            author.displayAvatarURL({
                                                size: 2048,
                                                dynamic: true
                                            })
                                        )
                                        .setDescription(`${client.config.yes} Successfully set the verification channel to <#${channel}>`)
                                        .setColor(chance.replace('BLUE', 'GREEN'))
                                
                                    return message.channel.send({
                                        embeds: [
                                            embed
                                        ]
                                    })
                                }
                            }
                        } else if (argCheck(content, 2).toLowerCase() === 'role') {
                            if (!argCheck(content, 3)) {
                                const embed = new MessageEmbed()
                                    .setAuthor(
                                        usertag,
                                        author.displayAvatarURL({
                                            size: 2048,
                                            dynamic: true
                                        })
                                    )
                                    .setTitle('Verification set class: role')
                                    .setDescription(`Set a verification role for your server; Set a role that adds to a user or removes it\n\nExample:\n${Formatters.codeBlock('js', 'verification set role <@&887905491336974357>')}\nOr with optional field:\n${Formatters.codeBlock('js', 'verification set role <@&887905491336974357> <@&867389671977123911>')}`)
                                    .setFooter('The optional field is the role being removed from the user')
                                    .setColor(chance)
                                
                                return message.channel.send({
                                    embeds: [
                                        embed
                                    ]
                                })
                            } else {
                                let option1 = argCheck(content, 3)
                                let option2 = argCheck(content, 4)
                                
                                option1 = option1?.match(/<@&(\d{17,19})>/g)
                                option2 = option2?.match(/<@&(\d{17,19})>/g)
                                
                                if (option1) option1 = option1[0].replace(/[^0-9]/g, '')
                                if (option2) option2 = option2[0].replace(/[^0-9]/g, '')
                                
                                if (!option1) option1 = argCheck(content, 3)
                                if (!option2) option2 = argCheck(content, 4)
                                
                                const manager = message?.guild?.roles?.cache
                                
                                const role = (i) => {
                                    const r = manager?.get(i) || manager?.find(x => x?.name === i?.toLowerCase() || x?.name?.toLowerCase()?.endsWith(i?.toLowerCase()) || x?.name?.toLowerCase()?.startsWith(i?.toLowerCase()) || x?.name?.toLowerCase()?.includes(i?.toLowerCase()))
                                    
                                    return r?.id
                                }
    
                                const embed = new MessageEmbed()
                                    .setAuthor(
                                        usertag,
                                        author.displayAvatarURL({
                                            size: 2048,
                                            dynamic: true
                                        })
                                    )
                                    .setDescription(`${client.config.yes} Set the verification roles`)
                                    .addField('Role 1 (Role being added to the user)', `<@&${role(option1)}>`, true)
                                    .setColor(chance.replace('BLUE', 'GREEN'))
                                
                                if (option1 && !option2) {
                                    if (!role(option1)) {
                                        return message.channel.send({
                                            content: `The role \`${option1}\` doesn't exist in this server (main field)`
                                        })
                                    } else {
                                        await client.db.set('database', `verification_role1_${message.guild.id}`, role(option1))
                                        
                                        return message.channel.send({
                                            embeds: [
                                                embed
                                            ]
                                        })
                                    }
                                } else if (option1 && option2) {
                                    if (!role(option1)) {
                                        return message.channel.send({
                                            content: `The role \`${option1}\` doesn't exist in this server (main field)`
                                        })
                                    } else if (!role(option2)) {
                                        return message.channel.send({
                                            content: `The role \`${option2}\` doesn't exist in this server (optional field)`
                                        })
                                    } else {
                                        await client.db.set('database', `verification_role1_${message.guild.id}`, role(option1))
                                        await client.db.set('database', `verification_role2_${message.guild.id}`, role(option2))
                                        
                                        return message.channel.send({
                                            embeds: [
                                                embed.addField('Role 2 (Role being removed from the user)', `<@&${role(option2)}>`, true)
                                            ]
                                        })
                                    }
                                }
                            }
                        }
                    }
                } else {
                    const embed = new MessageEmbed()
                        .setAuthor(
                            usertag,
                            author.displayAvatarURL({
                                size: 2048,
                                dynamic: true
                            })
                        )
                        .setDescription(`${client.config.no} You dont have the permission to use this command.\n\nMissing:\n\`manage channels\` and \`manage roles\``)
                        .setColor('RED')
                        
                    return message.channel.send({
                        embeds: [
                            embed
                        ]
                    })
                }
            } else if (argCheck(content, 1).toLowerCase() === 'verify') {
                const perms = ['MANAGE_ROLES']

                if (perms.every(p => message.channel.permissionsFor(client.user.id).has(p))) {
                    const role1 = await get(`verification_role1_${message.guild.id}`)
                    const role2 = await get(`verification_role2_${message.guild.id}`)
                    
                    const channel = await get(`verification_channel_${message.guild.id}`)
                    
                    if (!role1 || !channel) {
                        return message.channel.send({
                            content: 'Verification measures hasnt been yet set!!'
                        })
                    } else if (await get(`verification_channel_${message.guild.id}`) !== message.channel.id) {
                        return message.channel.send({
                            content: `Please go to the right channel to verify (<#${await get(`verification_channel_${message.guild.id}`)}>)`
                        })
                    } else {
                        const embed = new MessageEmbed()
                            .setAuthor(
                                usertag,
                                author.displayAvatarURL({
                                    size: 2048,
                                    dynamic: true
                                })
                            )
                            .setDescription('Please press the button to verify yourself by pressing the button. You only have 2 seconds')
                            .setColor(chance)

                        const button = new MessageButton()
                            .setLabel('Click me!')
                            .setCustomId('verification_verify')
                            .setStyle('PRIMARY')

                        const msg = await message.channel.send({
                            embeds: [
                                embed
                            ],
                            components: [
                                new MessageActionRow()
                                    .addComponents(button)
                            ]
                        })

                        let isfinished = false

                        const filter = i => i.customId === 'verification_verify' || i.isButton() || i.user.id === author.id
                        const collector = msg.createMessageComponentCollector({ filter, time: 2000 })

                        collector.on('collect', async (i) => {
                            //await i.deferUpdate()
                            
                            if (role1) await client.api.guilds(message.guild.id).members(author.id).roles(role1).put().catch(err => null)
                            if (role2) await client.api.guilds(message.guild.id).members(author.id).roles(role2).delete().catch(err => null)

                            i.update({
                                embeds: [
                                    embed.setDescription('Verified! You can now access the rest of the server').setColor(chance.replace('BLUE', 'GREEN'))
                                ],
                                components: [
                                    new MessageActionRow()
                                        .addComponents(button.setDisabled(true).setStyle('SUCCESS'))
                                ]
                            })

                            isfinished = true
                            collector.stop()
                        })

                        collector.on('end', async (i) => {
                            if (isfinished) return;

                            msg.edit({
                                embeds: [
                                    embed.setDescription('Verification failed :< Please try again').setColor('RED')
                                ],
                                components: [
                                    new MessageActionRow()
                                        .addComponents(button.setDisabled(true).setStyle('DANGER'))
                                ]
                            })
                            
                            isfinished = true
                        })
                    }
                } else {
                    const embed = new MessageEmbed()
                        .setAuthor(
                            usertag,
                            author.displayAvatarURL({
                                size: 2048,
                                dynamic: true
                            })
                        )
                        .setDescription(`${client.config.no} I dont have the permission to use this command.\n\nMissing:\n\`manage roles\``)
                        .setColor('RED')
                        
                    return message.channel.send({
                        embeds: [
                            embed
                        ]
                    })
                }
            }
        }
    }
}
