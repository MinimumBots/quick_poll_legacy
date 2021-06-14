"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ja = void 0;
const locale_1 = require("../locale");
const constants_1 = require("../../../constants");
const supportServerLink = `[ご質問・不具合の報告・要望はこちらへ](${constants_1.SUPPORT_SERVER_URL})`;
const botDocumentURL = `${constants_1.BOT_DOCUMENT_URL}/ja`;
exports.ja = {
    permissionNames: {
        CREATE_INSTANT_INVITE: '招待を作成',
        KICK_MEMBERS: 'メンバーをキック',
        BAN_MEMBERS: 'メンバーをBAN',
        ADMINISTRATOR: '管理者',
        MANAGE_CHANNELS: 'チャンネルの管理',
        MANAGE_GUILD: 'サーバー管理',
        ADD_REACTIONS: 'リアクションの追加',
        VIEW_AUDIT_LOG: '監査ログを表示',
        PRIORITY_SPEAKER: '優先スピーカー',
        STREAM: '動画',
        VIEW_CHANNEL: 'チャンネルを見る',
        SEND_MESSAGES: 'メッセージを送信',
        SEND_TTS_MESSAGES: 'テキスト読み上げメッセージを送信する',
        MANAGE_MESSAGES: 'メッセージの管理',
        EMBED_LINKS: '埋め込みリンク',
        ATTACH_FILES: 'ファイルを添付',
        READ_MESSAGE_HISTORY: 'メッセージ履歴を読む',
        MENTION_EVERYONE: '@everyone、@here、全てのロールにメンション',
        USE_EXTERNAL_EMOJIS: '外部の絵文字を使用する',
        VIEW_GUILD_INSIGHTS: 'サーバーインサイトを見る',
        CONNECT: '接続',
        SPEAK: '発言',
        MUTE_MEMBERS: 'メンバーをミュート',
        DEAFEN_MEMBERS: 'メンバーのスピーカーをミュート',
        MOVE_MEMBERS: 'メンバーを移動',
        USE_VAD: '音声検出の使用',
        CHANGE_NICKNAME: 'ニックネームの変更',
        MANAGE_NICKNAMES: 'ニックネームの管理',
        MANAGE_ROLES: 'ロールの管理',
        MANAGE_WEBHOOKS: 'ウェブフックの管理',
        MANAGE_EMOJIS: '絵文字の管理',
    },
    loadings: {
        poll: exclusive => ({
            color: exclusive ? constants_1.COLORS.EXPOLL : constants_1.COLORS.POLL,
            title: '⌛ アンケート生成中...'
        })
    },
    successes: {
        help: botInviteURL => ({
            color: constants_1.COLORS.HELP,
            title: '📊 Quick Pollの使い方',
            url: botDocumentURL,
            description: 'アンケートを作成し、投票を募ることができるBOTです。\n'
                + `各コマンドの詳しい使い方は**[こちら](${botDocumentURL})**をご覧ください。`,
            fields: [
                {
                    name: '🇦 🇧 🇨 🇩 …で選択できる投票を作る',
                    value: `\`\`\`${constants_1.COMMAND_PREFIX}poll 好きな果物は？ りんご ぶどう みかん キウイ\`\`\``
                },
                {
                    name: '任意の絵文字で選択できる投票を作る',
                    value: `\`\`\`${constants_1.COMMAND_PREFIX}poll 好きな果物は？ 🍎 りんご 🍇 ぶどう 🍊 みかん 🥝 キウイ\`\`\``
                },
                {
                    name: '⭕ ❌ の二択で選択できる投票を作る',
                    value: `\`\`\`${constants_1.COMMAND_PREFIX}poll メロンは果物である\`\`\``
                },
                {
                    name: 'ひとり一票だけの投票を作る',
                    value: `\`\`\`${constants_1.COMMAND_PREFIX}expoll "Party Parrotは何て動物？" インコ フクロウ カカポ オウム\`\`\``
                },
                {
                    name: '🌟 ヒント',
                    value: '```\n'
                        + `● 投票の選択肢は最大${constants_1.COMMAND_MAX_CHOICES}個まで\n`
                        + '● 文・絵文字の区切りは半角スペースか改行\n'
                        + '● 半角スペースを含めたい場合 "" で文を囲む\n'
                        + '● 画像を添付すると画像付きの投票を作成\n'
                        + '● アンケートを編集したい場合コマンドを編集\n'
                        + '```'
                },
                {
                    name: `↩️ でコマンドをキャンセル(${constants_1.COMMAND_EDITABLE_TIME / 60 / 1000}分以内)`,
                    value: `➡️ **[サーバーへ追加](${botInviteURL})**\n`
                        + `⚠️ ${supportServerLink}\n`
                        + `💟 **[運営資金を支援しませんか？(1口50円から)](${constants_1.DONATION_SERVICE_URL})**`
                }
            ]
        }),
        poll: (exclusive, authorIconURL, authorName, question, selectors, choices, imageName, channelID, messageID) => ({
            color: exclusive ? constants_1.COLORS.EXPOLL : constants_1.COLORS.POLL,
            author: {
                iconURL: authorIconURL,
                name: authorName
            },
            title: `${question}\u200C`,
            get description() {
                return selectors
                    .map((selector, i) => `\u200B${selector} ${choices[i]}\u200C`)
                    .join('\n');
            },
            fields: [{
                    name: '\u200B',
                    value: `[📊](${botDocumentURL}/sumpoll.html?channel_id=${channelID}&message_id=${messageID}) `
                        + `\`${constants_1.COMMAND_PREFIX}sumpoll ${messageID}\``
                }],
            footer: {
                text: `選択肢にリアクションで${exclusive ? '1人1票だけ' : ''}投票できます`
            },
            image: { url: imageName ? `attachment://${imageName}` : undefined }
        }),
        graphpoll: (pollURL, authorIconURL, authorName, question, selectors, choices, choiceCounts, choiceTops, choiceRates, choiceGraphs) => ({
            color: constants_1.COLORS.RESULT,
            author: {
                iconURL: authorIconURL,
                name: authorName
            },
            title: question,
            get fields() {
                const fields = selectors.map((selector, i) => ({
                    name: `${selector} ${choices[i]} (${choiceCounts[i]}票) ${choiceTops[i] ? '🏆' : ''}`,
                    value: `\`${choiceRates[i].padStart(5, ' ')}%\` ${choiceGraphs[i]}`
                }));
                fields.push({
                    name: '\u200B',
                    value: `[アンケートへ戻る](${pollURL})`
                });
                return fields;
            }
        }),
        listpoll: (pollURL, authorIconURL, authorName, question, selectors, choices, choiceCounts, choiceTops, choiceRates, choiceUsersLists) => ({
            color: constants_1.COLORS.RESULT,
            author: {
                iconURL: authorIconURL,
                name: authorName
            },
            title: question,
            url: pollURL,
            get fields() {
                const fields = selectors.map((selector, i) => ({
                    name: `${selector} ${choices[i]} (${choiceCounts[i]}票|${choiceRates[i]}%) ${choiceTops[i] ? '🏆' : ''}`,
                    value: choiceUsersLists[i]
                }));
                fields.push({
                    name: '\u200B',
                    value: `[アンケートへ戻る](${pollURL})`
                });
                return fields;
            }
        }),
        endpoll: () => ({
            color: constants_1.COLORS.ENDED,
            footer: { text: '投票は締め切られました' }
        })
    },
    errors: {
        unknown: () => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ 予期しない原因でコマンドの実行に失敗しました',
            description: `開発チームにエラー情報を送信しました\n\n${supportServerLink}`
        }),
        lackPermissions: permissions => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ BOTに必要な権限が不足しています',
            get description() {
                const names = permissions.map(permission => exports.ja.permissionNames[permission]);
                return '以下の権限が与えられているか確認してください\n'
                    + `\`\`\`\n${names.join('\n')}\n\`\`\``
                    + `\n\n${supportServerLink}`;
            }
        }),
        lackYourPermissions: permissions => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ コマンド実行者に必要な権限が不足しています',
            get description() {
                const names = permissions.map(permission => exports.ja.permissionNames[permission]);
                return '以下の権限が与えられているか確認してください\n'
                    + `\`\`\`\n${names.join('\n')}\n\`\`\``
                    + `\n\n${supportServerLink}`;
            }
        }),
        duplicateChannels: () => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ チャンネルが複数指定されています',
            description: supportServerLink
        }),
        unusableChannel: () => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ 使用できないチャンネルが指定されています',
            description: 'アンケートを送信できるのは同じサーバーのチャンネルのみです。\n\n'
                + supportServerLink
        }),
        unusableRole: () => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ 使用できないロールが指定されています',
            description: supportServerLink
        }),
        ungivenQuestion: () => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ 質問文が指定されていません',
            description: supportServerLink
        }),
        tooManyOptions: () => ({
            color: locale_1.DefaultColors.errors,
            title: `⚠️ 選択肢が ${constants_1.COMMAND_MAX_CHOICES} 個を超えています`,
            description: supportServerLink
        }),
        tooLongQuestion: () => ({
            color: locale_1.DefaultColors.errors,
            title: `⚠️ 質問文が ${constants_1.COMMAND_QUESTION_MAX} 文字を超えています`,
            description: supportServerLink
        }),
        tooLongOption: () => ({
            color: locale_1.DefaultColors.errors,
            title: `⚠️ 選択肢が ${constants_1.COMMAND_CHOICE_MAX} 文字を超えています`,
            description: supportServerLink
        }),
        duplicateEmojis: () => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ 絵文字が重複しています',
            description: supportServerLink
        }),
        unusableEmoji: () => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ 使用できない絵文字が含まれています',
            description: '以下のいずれかの理由により、BOTが絵文字を使用できません。\n'
                + `●\`${exports.ja.permissionNames.USE_EXTERNAL_EMOJIS}\`権限がこのBOTにない\n`
                + '●絵文字があるサーバーにこのBOTが導入されていない\n\n'
                + supportServerLink
        }),
        ungivenMessageID: () => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ メッセージIDが指定されていません',
            description: supportServerLink
        }),
        notFoundChannel: () => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ 指定されたチャンネルIDがサーバー内から見つかりません',
            description: supportServerLink
        }),
        notFoundPoll: () => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ 指定されたメッセージIDのアンケートが見つかりません',
            description: supportServerLink
        }),
        missingFormatPoll: () => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ 指定されたアンケートはフォーマットが正しくありません',
            description: supportServerLink
        }),
        unavailableExport: () => ({
            color: locale_1.DefaultColors.errors,
            title: `⚠️ ${constants_1.COMMAND_PREFIX}csvpollはコマンド編集で使用できません`,
            description: supportServerLink
        })
    },
    reports: {
        error: (executedCommand, traceTexts) => ({
            color: locale_1.DefaultColors.reports,
            title: '⚠️ エラーレポート',
            description: `実行コマンド\n\`\`\`${executedCommand}\`\`\``,
            get fields() {
                return traceTexts.map((text, i) => ({
                    name: `バックトレース${i + 1}`,
                    value: `\`\`\`${text}\`\`\``
                }));
            }
        })
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYm90L3RlbXBsYXRlcy9sb2NhbGVzL2phLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUEyRDtBQUMzRCxrREFVNEI7QUFFNUIsTUFBTSxpQkFBaUIsR0FBRyx3QkFBd0IsOEJBQWtCLEdBQUcsQ0FBQztBQUN4RSxNQUFNLGNBQWMsR0FBRyxHQUFHLDRCQUFnQixLQUFLLENBQUM7QUFFbkMsUUFBQSxFQUFFLEdBQW9CO0lBQ2pDLGVBQWUsRUFBRTtRQUNmLHFCQUFxQixFQUFFLE9BQU87UUFDOUIsWUFBWSxFQUFXLFVBQVU7UUFDakMsV0FBVyxFQUFZLFVBQVU7UUFDakMsYUFBYSxFQUFVLEtBQUs7UUFDNUIsZUFBZSxFQUFRLFVBQVU7UUFDakMsWUFBWSxFQUFXLFFBQVE7UUFDL0IsYUFBYSxFQUFVLFdBQVc7UUFDbEMsY0FBYyxFQUFTLFNBQVM7UUFDaEMsZ0JBQWdCLEVBQU8sU0FBUztRQUNoQyxNQUFNLEVBQWlCLElBQUk7UUFDM0IsWUFBWSxFQUFXLFVBQVU7UUFDakMsYUFBYSxFQUFVLFVBQVU7UUFDakMsaUJBQWlCLEVBQU0sb0JBQW9CO1FBQzNDLGVBQWUsRUFBUSxVQUFVO1FBQ2pDLFdBQVcsRUFBWSxTQUFTO1FBQ2hDLFlBQVksRUFBVyxTQUFTO1FBQ2hDLG9CQUFvQixFQUFHLFlBQVk7UUFDbkMsZ0JBQWdCLEVBQU8sOEJBQThCO1FBQ3JELG1CQUFtQixFQUFJLGFBQWE7UUFDcEMsbUJBQW1CLEVBQUksY0FBYztRQUNyQyxPQUFPLEVBQWdCLElBQUk7UUFDM0IsS0FBSyxFQUFrQixJQUFJO1FBQzNCLFlBQVksRUFBVyxXQUFXO1FBQ2xDLGNBQWMsRUFBUyxpQkFBaUI7UUFDeEMsWUFBWSxFQUFXLFNBQVM7UUFDaEMsT0FBTyxFQUFnQixTQUFTO1FBQ2hDLGVBQWUsRUFBUSxXQUFXO1FBQ2xDLGdCQUFnQixFQUFPLFdBQVc7UUFDbEMsWUFBWSxFQUFXLFFBQVE7UUFDL0IsZUFBZSxFQUFRLFdBQVc7UUFDbEMsYUFBYSxFQUFVLFFBQVE7S0FDaEM7SUFDRCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2xCLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLGtCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBTSxDQUFDLElBQUk7WUFDOUMsS0FBSyxFQUFFLGVBQWU7U0FDdkIsQ0FBQztLQUNIO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsSUFBSSxFQUFFLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNyQixLQUFLLEVBQUUsa0JBQU0sQ0FBQyxJQUFJO1lBQ2xCLEtBQUssRUFBRSxtQkFBbUI7WUFDMUIsR0FBRyxFQUFFLGNBQWM7WUFDbkIsV0FBVyxFQUFFLCtCQUErQjtrQkFDeEMsd0JBQXdCLGNBQWMsYUFBYTtZQUN2RCxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsSUFBSSxFQUFFLDBCQUEwQjtvQkFDaEMsS0FBSyxFQUFFLFNBQVMsMEJBQWMsb0NBQW9DO2lCQUNuRTtnQkFDRDtvQkFDRSxJQUFJLEVBQUUsbUJBQW1CO29CQUN6QixLQUFLLEVBQUUsU0FBUywwQkFBYyxnREFBZ0Q7aUJBQy9FO2dCQUNEO29CQUNFLElBQUksRUFBRSxvQkFBb0I7b0JBQzFCLEtBQUssRUFBRSxTQUFTLDBCQUFjLHNCQUFzQjtpQkFDckQ7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLGVBQWU7b0JBQ3JCLEtBQUssRUFBRSxTQUFTLDBCQUFjLG9EQUFvRDtpQkFDbkY7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsS0FBSyxFQUFFLE9BQU87MEJBQ1YsY0FBYywrQkFBbUIsT0FBTzswQkFDeEMseUJBQXlCOzBCQUN6Qiw0QkFBNEI7MEJBQzVCLHdCQUF3QjswQkFDeEIsMEJBQTBCOzBCQUMxQixLQUFLO2lCQUNWO2dCQUNEO29CQUNFLElBQUksRUFBRSxrQkFBa0IsaUNBQXFCLEdBQUcsRUFBRSxHQUFHLElBQUksTUFBTTtvQkFDL0QsS0FBSyxFQUFFLGtCQUFrQixZQUFZLE9BQU87MEJBQ3hDLE1BQU0saUJBQWlCLElBQUk7MEJBQzNCLGlDQUFpQyxnQ0FBb0IsS0FBSztpQkFDL0Q7YUFDRjtTQUNGLENBQUM7UUFDRixJQUFJLEVBQUUsQ0FDSixTQUFTLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFDbkcsRUFBRSxDQUFDLENBQUM7WUFDSixLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxrQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsa0JBQU0sQ0FBQyxJQUFJO1lBQzlDLE1BQU0sRUFBRTtnQkFDTixPQUFPLEVBQUUsYUFBYTtnQkFDdEIsSUFBSSxFQUFFLFVBQVU7YUFDakI7WUFDRCxLQUFLLEVBQUUsR0FBRyxRQUFRLFFBQVE7WUFDMUIsSUFBSSxXQUFXO2dCQUNiLE9BQU8sU0FBUztxQkFDYixHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxTQUFTLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztxQkFDN0QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hCLENBQUM7WUFDRCxNQUFNLEVBQUUsQ0FBQztvQkFDUCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxLQUFLLEVBQUUsUUFBUSxjQUFjLDRCQUE0QixTQUFTLGVBQWUsU0FBUyxJQUFJOzBCQUMxRixLQUFLLDBCQUFjLFdBQVcsU0FBUyxJQUFJO2lCQUNoRCxDQUFDO1lBQ0YsTUFBTSxFQUFFO2dCQUNOLElBQUksRUFBRSxjQUFjLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVE7YUFDdEQ7WUFDRCxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRTtTQUNwRSxDQUFDO1FBQ0YsU0FBUyxFQUFFLENBQ1QsT0FBTyxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUNySCxFQUFFLENBQUMsQ0FBQztZQUNKLEtBQUssRUFBRSxrQkFBTSxDQUFDLE1BQU07WUFDcEIsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixJQUFJLEVBQUUsVUFBVTthQUNqQjtZQUNELEtBQUssRUFBRSxRQUFRO1lBQ2YsSUFBSSxNQUFNO2dCQUNSLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUM3QyxJQUFJLEVBQUUsR0FBRyxRQUFRLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsTUFBTSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNwRixLQUFLLEVBQUUsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7aUJBQ3BFLENBQUMsQ0FBQyxDQUFDO2dCQUVKLE1BQU0sQ0FBQyxJQUFJLENBQUM7b0JBQ1YsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsS0FBSyxFQUFFLGNBQWMsT0FBTyxHQUFHO2lCQUNoQyxDQUFDLENBQUM7Z0JBRUgsT0FBTyxNQUFNLENBQUM7WUFDaEIsQ0FBQztTQUNGLENBQUM7UUFDRixRQUFRLEVBQUUsQ0FDUixPQUFPLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFDekgsRUFBRSxDQUFDLENBQUM7WUFDSixLQUFLLEVBQUUsa0JBQU0sQ0FBQyxNQUFNO1lBQ3BCLE1BQU0sRUFBRTtnQkFDTixPQUFPLEVBQUUsYUFBYTtnQkFDdEIsSUFBSSxFQUFFLFVBQVU7YUFDakI7WUFDRCxLQUFLLEVBQUUsUUFBUTtZQUNmLEdBQUcsRUFBRSxPQUFPO1lBQ1osSUFBSSxNQUFNO2dCQUNSLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUM3QyxJQUFJLEVBQUUsR0FBRyxRQUFRLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDdkcsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztpQkFDM0IsQ0FBQyxDQUFDLENBQUM7Z0JBRUosTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDVixJQUFJLEVBQUUsUUFBUTtvQkFDZCxLQUFLLEVBQUUsY0FBYyxPQUFPLEdBQUc7aUJBQ2hDLENBQUMsQ0FBQztnQkFFSCxPQUFPLE1BQU0sQ0FBQztZQUNoQixDQUFDO1NBQ0YsQ0FBQztRQUNGLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ2QsS0FBSyxFQUFFLGtCQUFNLENBQUMsS0FBSztZQUNuQixNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFO1NBQ2hDLENBQUM7S0FDSDtJQUNELE1BQU0sRUFBRTtRQUNOLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ2QsS0FBSyxFQUFFLHNCQUFhLENBQUMsTUFBTTtZQUMzQixLQUFLLEVBQUUsMkJBQTJCO1lBQ2xDLFdBQVcsRUFBRSx5QkFBeUIsaUJBQWlCLEVBQUU7U0FDMUQsQ0FBQztRQUNGLGVBQWUsRUFBRSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDL0IsS0FBSyxFQUFFLHNCQUFhLENBQUMsTUFBTTtZQUMzQixLQUFLLEVBQUUsc0JBQXNCO1lBQzdCLElBQUksV0FBVztnQkFDYixNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBRSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUM1RSxPQUFPLDBCQUEwQjtzQkFDN0IsV0FBVyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO3NCQUNyQyxPQUFPLGlCQUFpQixFQUFFLENBQUM7WUFDakMsQ0FBQztTQUNGLENBQUM7UUFDRixtQkFBbUIsRUFBRSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbkMsS0FBSyxFQUFFLHNCQUFhLENBQUMsTUFBTTtZQUMzQixLQUFLLEVBQUUsMEJBQTBCO1lBQ2pDLElBQUksV0FBVztnQkFDYixNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBRSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUM1RSxPQUFPLDBCQUEwQjtzQkFDN0IsV0FBVyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO3NCQUNyQyxPQUFPLGlCQUFpQixFQUFFLENBQUM7WUFDakMsQ0FBQztTQUNGLENBQUM7UUFDRixpQkFBaUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3hCLEtBQUssRUFBRSxzQkFBYSxDQUFDLE1BQU07WUFDM0IsS0FBSyxFQUFFLHFCQUFxQjtZQUM1QixXQUFXLEVBQUUsaUJBQWlCO1NBQy9CLENBQUM7UUFDRixlQUFlLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN0QixLQUFLLEVBQUUsc0JBQWEsQ0FBQyxNQUFNO1lBQzNCLEtBQUssRUFBRSx5QkFBeUI7WUFDaEMsV0FBVyxFQUFFLG9DQUFvQztrQkFDN0MsaUJBQWlCO1NBQ3RCLENBQUM7UUFDRixZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNuQixLQUFLLEVBQUUsc0JBQWEsQ0FBQyxNQUFNO1lBQzNCLEtBQUssRUFBRSx1QkFBdUI7WUFDOUIsV0FBVyxFQUFFLGlCQUFpQjtTQUMvQixDQUFDO1FBQ0YsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdEIsS0FBSyxFQUFFLHNCQUFhLENBQUMsTUFBTTtZQUMzQixLQUFLLEVBQUUsa0JBQWtCO1lBQ3pCLFdBQVcsRUFBRSxpQkFBaUI7U0FDL0IsQ0FBQztRQUNGLGNBQWMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssRUFBRSxzQkFBYSxDQUFDLE1BQU07WUFDM0IsS0FBSyxFQUFFLFdBQVcsK0JBQW1CLFdBQVc7WUFDaEQsV0FBVyxFQUFFLGlCQUFpQjtTQUMvQixDQUFDO1FBQ0YsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdEIsS0FBSyxFQUFFLHNCQUFhLENBQUMsTUFBTTtZQUMzQixLQUFLLEVBQUUsV0FBVyxnQ0FBb0IsWUFBWTtZQUNsRCxXQUFXLEVBQUUsaUJBQWlCO1NBQy9CLENBQUM7UUFDRixhQUFhLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNwQixLQUFLLEVBQUUsc0JBQWEsQ0FBQyxNQUFNO1lBQzNCLEtBQUssRUFBRSxXQUFXLDhCQUFrQixZQUFZO1lBQ2hELFdBQVcsRUFBRSxpQkFBaUI7U0FDL0IsQ0FBQztRQUNGLGVBQWUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3RCLEtBQUssRUFBRSxzQkFBYSxDQUFDLE1BQU07WUFDM0IsS0FBSyxFQUFFLGdCQUFnQjtZQUN2QixXQUFXLEVBQUUsaUJBQWlCO1NBQy9CLENBQUM7UUFDRixhQUFhLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNwQixLQUFLLEVBQUUsc0JBQWEsQ0FBQyxNQUFNO1lBQzNCLEtBQUssRUFBRSxzQkFBc0I7WUFDN0IsV0FBVyxFQUFFLGtDQUFrQztrQkFDM0MsTUFBTSxVQUFFLENBQUMsZUFBZSxDQUFDLG1CQUFtQixpQkFBaUI7a0JBQzdELGdDQUFnQztrQkFDaEMsaUJBQWlCO1NBQ3RCLENBQUM7UUFDRixnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZCLEtBQUssRUFBRSxzQkFBYSxDQUFDLE1BQU07WUFDM0IsS0FBSyxFQUFFLHNCQUFzQjtZQUM3QixXQUFXLEVBQUUsaUJBQWlCO1NBQy9CLENBQUM7UUFDRixlQUFlLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN0QixLQUFLLEVBQUUsc0JBQWEsQ0FBQyxNQUFNO1lBQzNCLEtBQUssRUFBRSxnQ0FBZ0M7WUFDdkMsV0FBVyxFQUFFLGlCQUFpQjtTQUMvQixDQUFDO1FBQ0YsWUFBWSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDbkIsS0FBSyxFQUFFLHNCQUFhLENBQUMsTUFBTTtZQUMzQixLQUFLLEVBQUUsK0JBQStCO1lBQ3RDLFdBQVcsRUFBRSxpQkFBaUI7U0FDL0IsQ0FBQztRQUNGLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDeEIsS0FBSyxFQUFFLHNCQUFhLENBQUMsTUFBTTtZQUMzQixLQUFLLEVBQUUsK0JBQStCO1lBQ3RDLFdBQVcsRUFBRSxpQkFBaUI7U0FDL0IsQ0FBQztRQUNGLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDeEIsS0FBSyxFQUFFLHNCQUFhLENBQUMsTUFBTTtZQUMzQixLQUFLLEVBQUUsTUFBTSwwQkFBYyx3QkFBd0I7WUFDbkQsV0FBVyxFQUFFLGlCQUFpQjtTQUMvQixDQUFDO0tBQ0g7SUFDRCxPQUFPLEVBQUU7UUFDUCxLQUFLLEVBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZDLEtBQUssRUFBRSxzQkFBYSxDQUFDLE9BQU87WUFDNUIsS0FBSyxFQUFFLFlBQVk7WUFDbkIsV0FBVyxFQUFFLGlCQUFpQixlQUFlLFFBQVE7WUFDckQsSUFBSSxNQUFNO2dCQUNSLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ2xDLElBQUksRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3ZCLEtBQUssRUFBRSxTQUFTLElBQUksUUFBUTtpQkFDN0IsQ0FBQyxDQUFDLENBQUM7WUFDTixDQUFDO1NBQ0YsQ0FBQztLQUNIO0NBQ0YsQ0FBQyJ9