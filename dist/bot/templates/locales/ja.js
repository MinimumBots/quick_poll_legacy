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
        MANAGE_EVENTS: 'イベントの管理',
        MANAGE_THREADS: 'スレッドの管理',
        USE_PUBLIC_THREADS: '公開スレッドを作成',
        CREATE_PUBLIC_THREADS: '公開スレッドを作成',
        USE_PRIVATE_THREADS: 'プライベートスレッドの作成',
        CREATE_PRIVATE_THREADS: 'プライベートスレッドの作成',
        USE_EXTERNAL_STICKERS: '外部のスタンプを使用する',
        SEND_MESSAGES_IN_THREADS: 'スレッドでメッセージを送信',
        START_EMBEDDED_ACTIVITIES: 'アクティビティを開始',
        MODERATE_MEMBERS: 'メンバーをタイムアウト',
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
                    value: `📊 \`${constants_1.COMMAND_PREFIX}sumpoll ${messageID}\``
                        + `\n[集計コマンドをコピー](${botDocumentURL}/sumpoll.html?channel_id=${channelID}&message_id=${messageID})`,
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
