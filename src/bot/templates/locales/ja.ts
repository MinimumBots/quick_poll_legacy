import { LocaleStructure, TemplateStructure } from '../template';
import {
  COMMAND_PREFIX,
  BOT_DOCUMENT_URL,
  SUPPORT_SERVER_URL,
  DONATION_SERVICE_URL,
  COMMAND_MAX_OPTIONS,
  COMMAND_QUESTION_MAX,
  COMMAND_OPTION_MAX
} from '../../constants';

const supportServerLink = `[ご質問・不具合報告](${SUPPORT_SERVER_URL})`;

export const templates: LocaleStructure = {
  loadings: {
    poll: {
      title: '⌛ 投票生成中...'
    }
  },
  successes: {
    help: {
      color: 0xff9440,
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
            + `● 投票の選択肢は最大${COMMAND_MAX_OPTIONS}個まで\n`
            + '● 文・絵文字の区切りは半角スペースか改行\n'
            + '● 半角スペースを含めたい場合 "" で文を囲む\n'
            + '● 画像を添付すると画像付きの投票を作成\n'
            + '● アンケートを編集したい場合コマンドを編集\n'
            + '```'
        },
        {
          name: '↩️ でコマンドをキャンセル(3分以内)',
          value: `💟 [BOT開発・運用資金の寄付](${DONATION_SERVICE_URL})\n`
            + `⚠️ ${supportServerLink}\n`
            + '➡️ **[サーバーへ追加]({{ botInviteURL }})**'
        }
      ]
    },
    poll: {
      author: {
        iconURL: '{{ pollAuthorIconURL }}',
        name: '{{ pollAuthorName }}'
      },
      title: '{{ pollQuestion }}',
      description: '{{ pollChoices }}\n\n'
        + `[📊](${BOT_DOCUMENT_URL}sumpoll) \`${COMMAND_PREFIX}sumpoll {{ pollMessageID }}\``,
      footer: { text: '選択肢にリアクションで投票できます' }
    },
    expoll: {
      author: {
        iconURL: '{{ pollAuthorIconURL }}',
        name: '{{ pollAuthorName }}'
      },
      title: '{{ pollQuestion }}',
      description: '{{ pollChoices }}\n\n'
        + `[📊](${BOT_DOCUMENT_URL}sumpoll) \`${COMMAND_PREFIX}sumpoll {{ pollMessageID }}\``,
      footer: { text: '選択肢にリアクションで1人1票だけ投票できます' }
    },
    graphpoll: {
      author: {
        iconURL: '{{ pollAuthorIconURL }}',
        name: '{{ pollAuthorName }}'
      },
      title: '{{ pollQuestion }}',
      field: {
        name: '{{ pollChoice }} ({{ pollChoiceCount }}票)',
        value: '`{{ pollChoiceRate }}%` {{ pollChoiceGraph }}'
      }
    },
    listpoll: {
      author: {
        iconURL: '{{ pollAuthorIconURL }}',
        name: '{{ pollAuthorName }}'
      },
      title: '{{ pollQuestion }}',
      field: {
        name: '{{ pollChoice }} ({{ pollChoiceCount }}票|{{ pollChoiceRate }}%)',
        value: '{{ polledUsersList }}'
      }
    }
  },
  errors: {
    unknown: {
      title: '⚠️ 予期しない原因でコマンドの実行に失敗しました',
      description: '開発チームにエラー情報を送信しました\n\n'
        + supportServerLink
    },
    lackPermission: {
      title: '⚠️ コマンドに必要な権限が不足しています',
      description: 'BOTに以下の権限が付与されているか確認してください\n'
        + '{{ lackPermissionNames }}\n\n'
        + supportServerLink
    },
    tooManyOptions: {
      title: `⚠️ 選択肢が ${COMMAND_MAX_OPTIONS} 個を超えています`,
      description: supportServerLink
    },
    tooLongQuestion: {
      title: `⚠️ 質問文が ${COMMAND_QUESTION_MAX} 文字を超えています`,
      description: supportServerLink
    },
    tooLongOption: {
      title: `⚠️ 選択肢が ${COMMAND_OPTION_MAX} 文字を超えています`,
      description: supportServerLink
    },
    duplicateEmojis: {
      title: '⚠️ 絵文字が重複しています',
      description: supportServerLink
    },
    unknownEmoji: {
      title: '⚠️ 使用できない絵文字が含まれています',
      description: '投票に外部サーバーの絵文字を使用したい場合は、そのサーバーへBOTを導入する必要があります。\n\n'
        + supportServerLink
    },
    unusableEmoji: {
      title: '⚠️ 使用できない絵文字が含まれています',
      description: 'BOTに与えられたロールでは使用できない絵文字が含まれています。\n\n'
        + supportServerLink
    },
    unavailableExclusive: {
      title: `⚠️ DM内では${COMMAND_PREFIX}expollコマンドを使用できません`,
      description: supportServerLink
    },
    notExistPoll: {
      title: '⚠️ 指定された投票が見つかりません',
      description: supportServerLink
    },
    notPolled: {
      title: '⚠️ まだ誰も投票していません',
      description: supportServerLink
    }
  },
  reports: {
    error: {
      title: '⚠️ エラーレポート',
      fields: [{ name: '実行コマンド', value: '{{ executedCommand }}' }],
      field: {
        name: 'バックトレース{{ stackTraceNumber }}',
        value: '```{{ stackTraceText }}```'
      }
    }
  }
};
