"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ja = void 0;
const locale_1 = require("../locale");
const constants_1 = require("../../../constants");
const supportServerLink = `[ご質問・不具合報告](${constants_1.SUPPORT_SERVER_URL})`;
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
        poll: () => ({
            color: locale_1.DefaultColors.loadings,
            title: '⌛ アンケート生成中...'
        })
    },
    successes: {
        help: botInviteURL => ({
            color: constants_1.COLORS.HELP,
            title: '📊 Quick Pollの使い方',
            url: `${constants_1.BOT_DOCUMENT_URL}`,
            description: 'アンケートを作成し、投票を募ることができるBOTです。\n'
                + `各コマンドの詳しい使い方は**[こちら](${constants_1.BOT_DOCUMENT_URL})**をご覧ください。`,
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
                    name: '↩️ でコマンドをキャンセル(3分以内)',
                    value: `💟 [BOT開発・運用資金の寄付](${constants_1.DONATION_SERVICE_URL})\n`
                        + `⚠️ ${supportServerLink}\n`
                        + `➡️ **[サーバーへ追加](${botInviteURL})**`
                }
            ]
        }),
        poll: (exclusive, authorIconURL, authorName, question, selectors, choices, imageName, messageID) => ({
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
                    value: `[📊](${constants_1.BOT_DOCUMENT_URL}sumpoll) `
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
            url: pollURL,
            get fields() {
                return selectors.map((selector, i) => ({
                    name: `${selector} ${choices[i]} (${choiceCounts[i]}票) ${choiceTops[i] ? '🏆' : ''}`,
                    value: `\`${choiceRates[i].padStart(5, ' ')}%\` ${choiceGraphs[i]}`
                }));
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
                return selectors.map((selector, i) => ({
                    name: `${selector} ${choices[i]} (${choiceCounts[i]}票|${choiceRates[i]}%) ${choiceTops[i] ? '🏆' : ''}`,
                    value: choiceUsersLists[i]
                }));
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
        unavailableChannel: () => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ DM内ではアンケートを送信するチャンネルは指定できません',
            description: supportServerLink
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
        unavailableExclusive: () => ({
            color: locale_1.DefaultColors.errors,
            title: `⚠️ DM内では${constants_1.COMMAND_PREFIX}expollコマンドを使用できません`,
            description: supportServerLink
        }),
        ungivenMessageID: () => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ メッセージIDが指定されていません',
            description: supportServerLink
        }),
        notFoundChannel: () => ({
            color: locale_1.DefaultColors.errors,
            title: '⚠️ 指定されたチャンネルIDがサーバー内から見つかりません'
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
        })
    },
    reports: {
        error: (executedCommand, traceTexts) => ({
            color: locale_1.DefaultColors.reports,
            title: '⚠️ エラーレポート',
            description: `実行コマンド\n\`\`\`${executedCommand}\`\`\``,
            get fields() {
                return traceTexts.map((text, i) => ({
                    name: `バックトレース${i}`,
                    value: `\`\`\`${text}\`\`\``
                }));
            }
        })
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYm90L3RlbXBsYXRlcy9sb2NhbGVzL2phLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUEyRDtBQUMzRCxrREFTNEI7QUFFNUIsTUFBTSxpQkFBaUIsR0FBRyxlQUFlLDhCQUFrQixHQUFHLENBQUM7QUFFbEQsUUFBQSxFQUFFLEdBQW9CO0lBQ2pDLGVBQWUsRUFBRTtRQUNmLHFCQUFxQixFQUFFLE9BQU87UUFDOUIsWUFBWSxFQUFXLFVBQVU7UUFDakMsV0FBVyxFQUFZLFVBQVU7UUFDakMsYUFBYSxFQUFVLEtBQUs7UUFDNUIsZUFBZSxFQUFRLFVBQVU7UUFDakMsWUFBWSxFQUFXLFFBQVE7UUFDL0IsYUFBYSxFQUFVLFdBQVc7UUFDbEMsY0FBYyxFQUFTLFNBQVM7UUFDaEMsZ0JBQWdCLEVBQU8sU0FBUztRQUNoQyxNQUFNLEVBQWlCLElBQUk7UUFDM0IsWUFBWSxFQUFXLFVBQVU7UUFDakMsYUFBYSxFQUFVLFVBQVU7UUFDakMsaUJBQWlCLEVBQU0sb0JBQW9CO1FBQzNDLGVBQWUsRUFBUSxVQUFVO1FBQ2pDLFdBQVcsRUFBWSxTQUFTO1FBQ2hDLFlBQVksRUFBVyxTQUFTO1FBQ2hDLG9CQUFvQixFQUFHLFlBQVk7UUFDbkMsZ0JBQWdCLEVBQU8sOEJBQThCO1FBQ3JELG1CQUFtQixFQUFJLGFBQWE7UUFDcEMsbUJBQW1CLEVBQUksY0FBYztRQUNyQyxPQUFPLEVBQWdCLElBQUk7UUFDM0IsS0FBSyxFQUFrQixJQUFJO1FBQzNCLFlBQVksRUFBVyxXQUFXO1FBQ2xDLGNBQWMsRUFBUyxpQkFBaUI7UUFDeEMsWUFBWSxFQUFXLFNBQVM7UUFDaEMsT0FBTyxFQUFnQixTQUFTO1FBQ2hDLGVBQWUsRUFBUSxXQUFXO1FBQ2xDLGdCQUFnQixFQUFPLFdBQVc7UUFDbEMsWUFBWSxFQUFXLFFBQVE7UUFDL0IsZUFBZSxFQUFRLFdBQVc7UUFDbEMsYUFB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