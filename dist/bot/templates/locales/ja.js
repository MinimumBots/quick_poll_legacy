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
        MANAGE_EMOJIS_AND_STICKERS: '絵文字・スタンプの管理',
        USE_APPLICATION_COMMANDS: 'アプリコマンドを使う',
        REQUEST_TO_SPEAK: 'スピーカー参加をリクエスト',
        MANAGE_THREADS: 'スレッドの管理',
        USE_PUBLIC_THREADS: '公開スレッドを作成',
        USE_PRIVATE_THREADS: 'プライベートスレッドを作成',
        USE_EXTERNAL_STICKERS: '外部のスタンプを使用する',
    },
    loadings: {
        poll: exclusive => ({
            color: exclusive ? constants_1.COLORS.EXPOLL : constants_1.COLORS.POLL,
            title: '⌛ アンケート生成中...'
        })
    },
    successes: {
        help: () => ({
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
                    value: `➡️ **[サーバーへ追加](${constants_1.BOT_INVITE_URL})**\n`
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYm90L3RlbXBsYXRlcy9sb2NhbGVzL2phLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUEyRDtBQUMzRCxrREFXNEI7QUFFNUIsTUFBTSxpQkFBaUIsR0FBRyx3QkFBd0IsOEJBQWtCLEdBQUcsQ0FBQztBQUN4RSxNQUFNLGNBQWMsR0FBRyxHQUFHLDRCQUFnQixLQUFLLENBQUM7QUFFbkMsUUFBQSxFQUFFLEdBQW9CO0lBQ2pDLGVBQWUsRUFBRTtRQUNmLHFCQUFxQixFQUFPLE9BQU87UUFDbkMsWUFBWSxFQUFnQixVQUFVO1FBQ3RDLFdBQVcsRUFBaUIsVUFBVTtRQUN0QyxhQUFhLEVBQWUsS0FBSztRQUNqQyxlQUFlLEVBQWEsVUFBVTtRQUN0QyxZQUFZLEVBQWdCLFFBQVE7UUFDcEMsYUFBYSxFQUFlLFdBQVc7UUFDdkMsY0FBYyxFQUFjLFNBQVM7UUFDckMsZ0JBQWdCLEVBQVksU0FBUztRQUNyQyxNQUFNLEVBQXNCLElBQUk7UUFDaEMsWUFBWSxFQUFnQixVQUFVO1FBQ3RDLGFBQWEsRUFBZSxVQUFVO1FBQ3RDLGlCQUFpQixFQUFXLG9CQUFvQjtRQUNoRCxlQUFlLEVBQWEsVUFBVTtRQUN0QyxXQUFXLEVBQWlCLFNBQVM7UUFDckMsWUFBWSxFQUFnQixTQUFTO1FBQ3JDLG9CQUFvQixFQUFRLFlBQVk7UUFDeEMsZ0JBQWdCLEVBQVksOEJBQThCO1FBQzFELG1CQUFtQixFQUFTLGFBQWE7UUFDekMsbUJBQW1CLEVBQVMsY0FBYztRQUMxQyxPQUFPLEVBQXFCLElBQUk7UUFDaEMsS0FBSyxFQUF1QixJQUFJO1FBQ2hDLFlBQVksRUFBZ0IsV0FBVztRQUN2QyxjQUFjLEVBQWMsaUJBQWlCO1FBQzdDLFlBQVksRUFBZ0IsU0FBUztRQUNyQyxPQUFPLEVBQXFCLFNBQVM7UUFDckMsZUFBZSxFQUFhLFdBQVc7UUFDdkMsZ0JBQWdCLEVBQVksV0FB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