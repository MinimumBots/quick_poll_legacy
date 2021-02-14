import { TemplateEmbedsStruct } from '../template';
import { COMMAND_PREFIX } from '../../constants';

const botDocumentURL     = 'https://grapecolor.github.io/quick_poll/';
const supportServerURL   = 'https://discord.gg/STzZ6GK';
const donationServiceURL = 'https://ofuse.me/users/grapecolor';
const supportInformation = `[ご質問・不具合報告](${supportServerURL})`;

export const templates: TemplateEmbedsStruct = {
  loadings: {
    poll: {
      title: '⌛ 投票生成中...'
    }
  },
  successes: {
    help: {
      title: '📊 Quick Pollの使い方',
      url: `${botDocumentURL}`,
      description: 'アンケートを作成し、投票を募ることができるBOTです。\n'
        + `各コマンドの詳しい使い方は**[こちら](${botDocumentURL})**をご覧ください。`,
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
          value: `💟 [BOT開発・運用資金の寄付](${donationServiceURL})\n`
            + `⚠️ ${supportInformation}\n`
            + '➡️ **[サーバーへ追加](${BOT_INVITE_URL})**'
        }
      ]
    },
    poll: {
      author: {
        icon_url: '${POLL_AUTHOR_ICON_URL}',
        name: '${POLL_AUTHOR_NAME}'
      },
      title: '${POLL_QUESTION}',
      description: '${POLL_CHOICES}\n\n'
        + `[📊](${botDocumentURL}sumpoll) \`${COMMAND_PREFIX}sumpoll \${POLL_MESSAGE_ID}\``,
      footer: { text: '選択肢にリアクションで投票できます' }
    },
    expoll: {
      author: {
        icon_url: '${POLL_AUTHOR_ICON_URL}',
        name: '${POLL_AUTHOR_NAME}'
      },
      title: '${POLL_QUESTION}',
      description: '${POLL_CHOICES}\n\n'
        + `[📊](${botDocumentURL}sumpoll) \`${COMMAND_PREFIX}sumpoll \${POLL_MESSAGE_ID}\``,
      footer: { text: '選択肢にリアクションで1人1票だけ投票できます' }
    },
    graphpoll: {
      author: {
        icon_url: '${POLL_AUTHOR_ICON_URL}',
        name: '${POLL_AUTHOR_NAME}'
      },
      title: '${POLL_QUESTION}',
      field: {
        name: '${POLL_CHOICE} (${POLL_CHOICE_COUNT}票)',
        value: '`${POLL_CHOICE_RATE}%` ${POLL_CHOICE_GRAPH}'
      }
    },
    listpoll: {
      author: {
        icon_url: '${POLL_AUTHOR_ICON_URL}',
        name: '${POLL_AUTHOR_NAME}'
      },
      title: '${POLL_QUESTION}',
      field: {
        name: '${POLL_CHOICE} (${POLL_CHOICE_COUNT}票|${POLL_CHOICE_RATE}%)',
        value: '${POLLED_USERS_LIST}'
      }
    }
  },
  errors: {},
};
