import { Template, TemplatesStructure } from '../template';
import {
  COMMAND_PREFIX,
  BOT_DOCUMENT_URL,
  SUPPORT_SERVER_URL,
  DONATION_SERVICE_URL,
  POLL_MAX_OPTIONS,
  POLL_QUESTION_MAX,
  POLL_OPTION_MAX
} from '../../constants';

const supportServerLink = `[ご質問・不具合報告](${SUPPORT_SERVER_URL})`;

export const templates: TemplatesStructure = {
  loadings: {
    poll: new Template({
      title: '⌛ 投票生成中...'
    })
  },
  successes: {
    help: new Template({
      title: '📊 Quick Pollの使い方',
      url: `${BOT_DOCUMENT_URL}`,
      description: 'アンケートを作成し、投票を募ることができるBOTです。\n'
        + `各コマンドの詳しい使い方は**[こちら](${BOT_DOCUMENT_URL})**をご覧ください。`,
      fields: [
        {
          name: '🇦 🇧 🇨 🇩 …で選択できる投票を作る',
          value: `\`\`\`${COMMAND_PREFIX}poll 好きな果物は？ りんご ぶどう みかん キウイ\`\`\``
        },
        {
          name: '任意の絵文字で選択できる投票を作る',
          value: `\`\`\`${COMMAND_PREFIX}poll 好きな果物は？ 🍎 りんご 🍇 ぶどう 🍊 みかん 🥝 キウイ\`\`\``
        },
        {
          name: '⭕ ❌ の二択で選択できる投票を作る',
          value: `\`\`\`${COMMAND_PREFIX}poll メロンは果物である\`\`\``
        },
        {
          name: 'ひとり一票だけの投票を作る',
          value: `\`\`\`${COMMAND_PREFIX}expoll "Party Parrotは何て動物？" インコ フクロウ カカポ オウム\`\`\``
        },
        {
          name: '🌟 ヒント',
          value: '```\n'
            + '● 投票の選択肢は最大20個まで\n'
            + '● 文・絵文字の区切りは半角スペースか改行\n'
            + '● 半角スペースを含めたい場合 "" で文を囲む\n'
            + '● 画像を添付すると画像付きの投票を作成\n'
            + '● アンケートを編集したい場合コマンドを編集\n'
            + '```'
        },
        {
          name: '↩️ でコマンド実行をキャンセル(3分以内)',
          value: `💟 [BOT開発・運用資金の寄付](${DONATION_SERVICE_URL})\n`
            + `⚠️ ${supportServerLink}\n`
            + '➡️ **[サーバーへ追加]({{ BOT_INVITE_URL }})**'
        }
      ]
    }),
    poll: new Template({
      author: {
        iconURL: '{{ POLL_AUTHOR_ICON_URL }}',
        name: '{{ POLL_AUTHOR_NAME }}'
      },
      title: '{{ POLL_QUESTION }}',
      description: '{{ POLL_CHOICES }}\n\n'
        + `[📊](${BOT_DOCUMENT_URL}sumpoll) \`${COMMAND_PREFIX}sumpoll {{ POLL_MESSAGE_ID }}\``,
      footer: { text: '選択肢にリアクションで投票できます' }
    }),
    expoll: new Template({
      author: {
        iconURL: '{{ POLL_AUTHOR_ICON_URL }}',
        name: '{{ POLL_AUTHOR_NAME }}'
      },
      title: '{{ POLL_QUESTION }}',
      description: '{{ POLL_CHOICES }}\n\n'
        + `[📊](${BOT_DOCUMENT_URL}sumpoll) \`${COMMAND_PREFIX}sumpoll {{ POLL_MESSAGE_ID }}\``,
      footer: { text: '選択肢にリアクションで1人1票だけ投票できます' }
    }),
    graphpoll: new Template({
      author: {
        iconURL: '{{ POLL_AUTHOR_ICON_URL }}',
        name: '{{ POLL_AUTHOR_NAME }}'
      },
      title: '{{ POLL_QUESTION }}',
      field: {
        name: '{{ POLL_CHOICE }} ({{ POLL_CHOICE_COUNT }}票)',
        value: '`{{ POLL_CHOICE_RATE }}%` {{ POLL_CHOICE_GRAPH }}'
      }
    }),
    listpoll: new Template({
      author: {
        iconURL: '{{ POLL_AUTHOR_ICON_URL }}',
        name: '{{ POLL_AUTHOR_NAME }}'
      },
      title: '{{ POLL_QUESTION }}',
      field: {
        name: '{{ POLL_CHOICE }} ({{ POLL_CHOICE_COUNT }}票|{{ POLL_CHOICE_RATE }}%)',
        value: '{{ POLLED_USERS_LIST }}'
      }
    })
  },
  errors: {
    common: {
      unknown: new Template({
        title: '⚠️ 予期しない原因でコマンドの実行に失敗しました',
        description: '開発チームにエラー情報を送信しました\n\n'
          + `${supportServerLink}`
      }),
      lackPermission: new Template({
        title: '⚠️ コマンドに必要な権限が不足しています',
        description: 'BOTに以下の権限が付与されているか確認してください\n'
          + '{{ LACK_PERMISSION_NAMES }}\n\n'
          + supportServerLink
      })
    },
    poll: {
      tooManyOptions: new Template({
        title: `⚠️ 選択肢が ${POLL_MAX_OPTIONS} 個を超えています`,
        description: supportServerLink
      }),
      tooLongQuestion: new Template({
        title: `⚠️ 質問文が ${POLL_QUESTION_MAX} 文字を超えています`,
        description: supportServerLink
      }),
      tooLongOption: new Template({
        title: `⚠️ 選択肢が ${POLL_OPTION_MAX} 文字を超えています`,
        description: supportServerLink
      }),
      duplicateEmojis: new Template({
        title: '⚠️ 絵文字が重複しています',
        description: supportServerLink
      }),
      unknownEmoji: new Template({
        title: '⚠️ 使用できない絵文字が含まれています',
        description: '投票に外部サーバーの絵文字を使用したい場合は、そのサーバーへBOTを導入する必要があります。\n\n'
          + supportServerLink
      }),
      unavailableEmoji: new Template({
        title: '⚠️ 使用できない絵文字が含まれています',
        description: 'BOTに与えられたロールでは使用できない絵文字が含まれています。\n\n'
          + supportServerLink
      })
    },
    expoll: {
      unavailableExclusive: new Template({
        title: `⚠️ DM内では${COMMAND_PREFIX}expollコマンドを使用できません`,
        description: supportServerLink
      })
    },
    sumpoll: {
      notExistPoll: new Template({
        title: '⚠️ 指定された投票が見つかりません',
        description: supportServerLink
      }),
      notPolled: new Template({
        title: '⚠️ まだ誰も投票していません',
        description: supportServerLink
      })
    }
  }
};
