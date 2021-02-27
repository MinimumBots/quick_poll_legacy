"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templates = void 0;
const template_1 = require("../template");
const constants_1 = require("../../constants");
const supportServerLink = `[ご質問・不具合報告](${constants_1.SUPPORT_SERVER_URL})`;
exports.templates = {
    loadings: {
        poll: new template_1.Template({
            title: '⌛ 投票生成中...'
        })
    },
    successes: {
        help: new template_1.Template({
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
                        + `● 投票の選択肢は最大${constants_1.COMMAND_MAX_OPTIONS}個まで\n`
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
                        + '➡️ **[サーバーへ追加]({{ botInviteURL }})**'
                }
            ]
        }),
        poll: new template_1.Template({
            author: {
                iconURL: '{{ pollAuthorIconURL }}',
                name: '{{ pollAuthorName }}'
            },
            title: '{{ pollQuestion }}',
            description: '{{ pollChoices }}\n\n'
                + `[📊](${constants_1.BOT_DOCUMENT_URL}sumpoll) \`${constants_1.COMMAND_PREFIX}sumpoll {{ pollMessageID }}\``,
            footer: { text: '選択肢にリアクションで投票できます' }
        }),
        expoll: new template_1.Template({
            author: {
                iconURL: '{{ pollAuthorIconURL }}',
                name: '{{ pollAuthorName }}'
            },
            title: '{{ pollQuestion }}',
            description: '{{ pollChoices }}\n\n'
                + `[📊](${constants_1.BOT_DOCUMENT_URL}sumpoll) \`${constants_1.COMMAND_PREFIX}sumpoll {{ pollMessageID }}\``,
            footer: { text: '選択肢にリアクションで1人1票だけ投票できます' }
        }),
        graphpoll: new template_1.Template({
            author: {
                iconURL: '{{ pollAuthorIconURL }}',
                name: '{{ pollAuthorName }}'
            },
            title: '{{ pollQuestion }}',
            field: {
                name: '{{ pollChoice }} ({{ pollChoiceCount }}票)',
                value: '`{{ pollChoiceRate }}%` {{ pollChoiceGraph }}'
            }
        }),
        listpoll: new template_1.Template({
            author: {
                iconURL: '{{ pollAuthorIconURL }}',
                name: '{{ pollAuthorName }}'
            },
            title: '{{ pollQuestion }}',
            field: {
                name: '{{ pollChoice }} ({{ pollChoiceCount }}票|{{ pollChoiceRate }}%)',
                value: '{{ polledUsersList }}'
            }
        })
    },
    errors: {
        unknown: new template_1.Template({
            title: '⚠️ 予期しない原因でコマンドの実行に失敗しました',
            description: '開発チームにエラー情報を送信しました\n\n'
                + supportServerLink
        }),
        lackPermission: new template_1.Template({
            title: '⚠️ コマンドに必要な権限が不足しています',
            description: 'BOTに以下の権限が付与されているか確認してください\n'
                + '{{ lackPermissionNames }}\n\n'
                + supportServerLink
        }),
        tooManyOptions: new template_1.Template({
            title: `⚠️ 選択肢が ${constants_1.COMMAND_MAX_OPTIONS} 個を超えています`,
            description: supportServerLink
        }),
        tooLongQuestion: new template_1.Template({
            title: `⚠️ 質問文が ${constants_1.COMMAND_QUESTION_MAX} 文字を超えています`,
            description: supportServerLink
        }),
        tooLongOption: new template_1.Template({
            title: `⚠️ 選択肢が ${constants_1.COMMAND_OPTION_MAX} 文字を超えています`,
            description: supportServerLink
        }),
        duplicateEmojis: new template_1.Template({
            title: '⚠️ 絵文字が重複しています',
            description: supportServerLink
        }),
        unknownEmoji: new template_1.Template({
            title: '⚠️ 使用できない絵文字が含まれています',
            description: '投票に外部サーバーの絵文字を使用したい場合は、そのサーバーへBOTを導入する必要があります。\n\n'
                + supportServerLink
        }),
        unusableEmoji: new template_1.Template({
            title: '⚠️ 使用できない絵文字が含まれています',
            description: 'BOTに与えられたロールでは使用できない絵文字が含まれています。\n\n'
                + supportServerLink
        }),
        unavailableExclusive: new template_1.Template({
            title: `⚠️ DM内では${constants_1.COMMAND_PREFIX}expollコマンドを使用できません`,
            description: supportServerLink
        }),
        notExistPoll: new template_1.Template({
            title: '⚠️ 指定された投票が見つかりません',
            description: supportServerLink
        }),
        notPolled: new template_1.Template({
            title: '⚠️ まだ誰も投票していません',
            description: supportServerLink
        })
    },
    reports: {
        error: new template_1.Template({
            title: '⚠️ エラーレポート',
            fields: [{ name: '実行コマンド', value: '{{ executedCommand }}' }],
            field: {
                name: 'バックトレース{{ stackTraceNumber }}',
                value: '```{{ stackTraceText }}```'
            }
        })
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYm90L3RlbXBsYXRlcy9sb2NhbGVzL2phLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBDQUEyRDtBQUMzRCwrQ0FReUI7QUFFekIsTUFBTSxpQkFBaUIsR0FBRyxlQUFlLDhCQUFrQixHQUFHLENBQUM7QUFFbEQsUUFBQSxTQUFTLEdBQXVCO0lBQzNDLFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSxJQUFJLG1CQUFRLENBQUM7WUFDakIsS0FBSyxFQUFFLFlBQVk7U0FDcEIsQ0FBQztLQUNIO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsSUFBSSxFQUFFLElBQUksbUJBQVEsQ0FBQztZQUNqQixLQUFLLEVBQUUsbUJBQW1CO1lBQzFCLEdBQUcsRUFBRSxHQUFHLDRCQUFnQixFQUFFO1lBQzFCLFdBQVcsRUFBRSwrQkFBK0I7a0JBQ3hDLHdCQUF3Qiw0QkFBZ0IsYUFBYTtZQUN6RCxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsSUFBSSxFQUFFLDBCQUEwQjtvQkFDaEMsS0FBSyxFQUFFLFNBQVMsMEJBQWMsb0NBQW9DO2lCQUNuRTtnQkFDRDtvQkFDRSxJQUFJLEVBQUUsbUJBQW1CO29CQUN6QixLQUFLLEVBQUUsU0FBUywwQkFBYyxnREFBZ0Q7aUJBQy9FO2dCQUNEO29CQUNFLElBQUksRUFBRSxvQkFBb0I7b0JBQzFCLEtBQUssRUFBRSxTQUFTLDBCQUFjLHNCQUFzQjtpQkFDckQ7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLGVBQWU7b0JBQ3JCLEtBQUssRUFBRSxTQUFTLDBCQUFjLG9EQUFvRDtpQkFDbkY7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsS0FBSyxFQUFFLE9BQU87MEJBQ1YsY0FBYywrQkFBbUIsT0FBTzswQkFDeEMseUJBQXlCOzBCQUN6Qiw0QkFBNEI7MEJBQzVCLHdCQUF3QjswQkFDeEIsMEJBQTBCOzBCQUMxQixLQUFLO2lCQUNWO2dC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