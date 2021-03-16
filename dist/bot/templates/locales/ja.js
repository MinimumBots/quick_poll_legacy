"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ja = void 0;
const locale_1 = require("../locale");
const constants_1 = require("../../../constants");
const supportServerLink = `[ご質問・不具合報告](${constants_1.SUPPORT_SERVER_URL})`;
const botDocumentURL = `${constants_1.BOT_DOCUMENT_URL}ja/`;
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
                    value: `[📊](${botDocumentURL}sumpoll) `
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
            title: `⚠️ DMチャンネル内では${constants_1.COMMAND_PREFIX}expollコマンドを使用できません`,
            description: supportServerLink
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYm90L3RlbXBsYXRlcy9sb2NhbGVzL2phLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUEyRDtBQUMzRCxrREFVNEI7QUFFNUIsTUFBTSxpQkFBaUIsR0FBRyxlQUFlLDhCQUFrQixHQUFHLENBQUM7QUFDL0QsTUFBTSxjQUFjLEdBQUcsR0FBRyw0QkFBZ0IsS0FBSyxDQUFDO0FBRW5DLFFBQUEsRUFBRSxHQUFvQjtJQUNqQyxlQUFlLEVBQUU7UUFDZixxQkFBcUIsRUFBRSxPQUFPO1FBQzlCLFlBQVksRUFBVyxVQUFVO1FBQ2pDLFdBQVcsRUFBWSxVQUFVO1FBQ2pDLGFBQWEsRUFBVSxLQUFLO1FBQzVCLGVBQWUsRUFBUSxVQUFVO1FBQ2pDLFlBQVksRUFBVyxRQUFRO1FBQy9CLGFBQWEsRUFBVSxXQUFXO1FBQ2xDLGNBQWMsRUFBUyxTQUFTO1FBQ2hDLGdCQUFnQixFQUFPLFNBQVM7UUFDaEMsTUFBTSxFQUFpQixJQUFJO1FBQzNCLFlBQVksRUFBVyxVQUFVO1FBQ2pDLGFBQWEsRUFBVSxVQUFVO1FBQ2pDLGlCQUFpQixFQUFNLG9CQUFvQjtRQUMzQyxlQUFlLEVBQVEsVUFBVTtRQUNqQyxXQUFXLEVBQVksU0FBUztRQUNoQyxZQUFZLEVBQVcsU0FBUztRQUNoQyxvQkFBb0IsRUFBRyxZQUFZO1FBQ25DLGdCQUFnQixFQUFPLDhCQUE4QjtRQUNyRCxtQkFBbUIsRUFBSSxhQUFhO1FBQ3BDLG1CQUFtQixFQUFJLGNBQWM7UUFDckMsT0FBTyxFQUFnQixJQUFJO1FBQzNCLEtBQUssRUFBa0IsSUFBSTtRQUMzQixZQUFZLEVBQVcsV0FBVztRQUNsQyxjQUFjLEVBQVMsaUJBQWlCO1FBQ3hDLFlBQVksRUFBVyxTQUFTO1FBQ2hDLE9BQU8sRUFBZ0IsU0FBUztRQUNoQyxlQUFlLEVBQVEsV0FBVztRQUNsQyxnQkFBZ0IsRUFBTyxXQUFXO1FBQ2xDLFlB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