import { LocaleStructure, DefaultColors } from '../locale';
import {
  COMMAND_PREFIX,
  BOT_DOCUMENT_URL,
  SUPPORT_SERVER_URL,
  DONATION_SERVICE_URL,
  COMMAND_MAX_CHOICES,
  COMMAND_QUESTION_MAX,
  COMMAND_CHOICE_MAX,
  COLORS,
  COMMAND_EDITABLE_TIME,
} from '../../../constants';

const supportServerLink = `[ご質問・不具合報告](${SUPPORT_SERVER_URL})`;

export const ja: LocaleStructure = {
  permissionNames: {
    CREATE_INSTANT_INVITE: '招待を作成',
    KICK_MEMBERS         : 'メンバーをキック',
    BAN_MEMBERS          : 'メンバーをBAN',
    ADMINISTRATOR        : '管理者',
    MANAGE_CHANNELS      : 'チャンネルの管理',
    MANAGE_GUILD         : 'サーバー管理',
    ADD_REACTIONS        : 'リアクションの追加',
    VIEW_AUDIT_LOG       : '監査ログを表示',
    PRIORITY_SPEAKER     : '優先スピーカー',
    STREAM               : '動画',
    VIEW_CHANNEL         : 'チャンネルを見る',
    SEND_MESSAGES        : 'メッセージを送信',
    SEND_TTS_MESSAGES    : 'テキスト読み上げメッセージを送信する',
    MANAGE_MESSAGES      : 'メッセージの管理',
    EMBED_LINKS          : '埋め込みリンク',
    ATTACH_FILES         : 'ファイルを添付',
    READ_MESSAGE_HISTORY : 'メッセージ履歴を読む',
    MENTION_EVERYONE     : '@everyone、@here、全てのロールにメンション',
    USE_EXTERNAL_EMOJIS  : '外部の絵文字を使用する',
    VIEW_GUILD_INSIGHTS  : 'サーバーインサイトを見る',
    CONNECT              : '接続',
    SPEAK                : '発言',
    MUTE_MEMBERS         : 'メンバーをミュート',
    DEAFEN_MEMBERS       : 'メンバーのスピーカーをミュート',
    MOVE_MEMBERS         : 'メンバーを移動',
    USE_VAD              : '音声検出の使用',
    CHANGE_NICKNAME      : 'ニックネームの変更',
    MANAGE_NICKNAMES     : 'ニックネームの管理',
    MANAGE_ROLES         : 'ロールの管理',
    MANAGE_WEBHOOKS      : 'ウェブフックの管理',
    MANAGE_EMOJIS        : '絵文字の管理',
  },
  loadings: {
    poll: () => ({
      color: DefaultColors.loadings,
      title: '⌛ アンケート生成中...'
    })
  },
  successes: {
    help: botInviteURL => ({
      color: COLORS.HELP,
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
            + `● 投票の選択肢は最大${COMMAND_MAX_CHOICES}個まで\n`
            + '● 文・絵文字の区切りは半角スペースか改行\n'
            + '● 半角スペースを含めたい場合 "" で文を囲む\n'
            + '● 画像を添付すると画像付きの投票を作成\n'
            + '● アンケートを編集したい場合コマンドを編集\n'
            + '```'
        },
        {
          name: `↩️ でコマンドをキャンセル(${COMMAND_EDITABLE_TIME / 60 / 1000}分以内)`,
          value: `💟 [BOT開発・運用資金の寄付](${DONATION_SERVICE_URL})\n`
            + `⚠️ ${supportServerLink}\n`
            + `➡️ **[サーバーへ追加](${botInviteURL})**`
        }
      ]
    }),
    poll: (
      exclusive, authorIconURL, authorName, question, selectors, choices, imageName, messageID
    ) => ({
      color: exclusive ? COLORS.EXPOLL : COLORS.POLL,
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
        value: `[📊](${BOT_DOCUMENT_URL}sumpoll) `
          + `\`${COMMAND_PREFIX}sumpoll ${messageID}\``
      }],
      footer: {
        text: `選択肢にリアクションで${exclusive ? '1人1票だけ' : ''}投票できます`
      },
      image: { url: imageName ? `attachment://${imageName}` : undefined }
    }),
    graphpoll: (
      pollURL, authorIconURL, authorName, question, selectors, choices, choiceCounts, choiceTops, choiceRates, choiceGraphs
    ) => ({
      color: COLORS.RESULT,
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
    listpoll: (
      pollURL, authorIconURL, authorName, question, selectors, choices, choiceCounts, choiceTops, choiceRates, choiceUsersLists
    ) => ({
      color: COLORS.RESULT,
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
      color: COLORS.ENDED,
      footer: { text: '投票は締め切られました' }
    })
  },
  errors: {
    unknown: () => ({
      color: DefaultColors.errors,
      title: '⚠️ 予期しない原因でコマンドの実行に失敗しました',
      description: `開発チームにエラー情報を送信しました\n\n${supportServerLink}`
    }),
    lackPermissions: permissions => ({
      color: DefaultColors.errors,
      title: '⚠️ BOTに必要な権限が不足しています',
      get description() {
        const names = permissions.map(permission => ja.permissionNames[permission]);
        return '以下の権限が与えられているか確認してください\n'
          + `\`\`\`\n${names.join('\n')}\n\`\`\``
          + `\n\n${supportServerLink}`;
      }
    }),
    lackYourPermissions: permissions => ({
      color: DefaultColors.errors,
      title: '⚠️ コマンド実行者に必要な権限が不足しています',
      get description() {
        const names = permissions.map(permission => ja.permissionNames[permission]);
        return '以下の権限が与えられているか確認してください\n'
          + `\`\`\`\n${names.join('\n')}\n\`\`\``
          + `\n\n${supportServerLink}`;
      }
    }),
    duplicateChannels: () => ({
      color: DefaultColors.errors,
      title: '⚠️ チャンネルが複数指定されています',
      description: supportServerLink
    }),
    unusableChannel: () => ({
      color: DefaultColors.errors,
      title: '⚠️ 使用できないチャンネルが指定されています',
      description: 'アンケートを送信できるのは同じサーバーのチャンネルのみです。\n\n'
        + supportServerLink
    }),
    unavailableChannel: () => ({
      color: DefaultColors.errors,
      title: '⚠️ DM内ではアンケートを送信するチャンネルは指定できません',
      description: supportServerLink
    }),
    unusableRole: () => ({
      color: DefaultColors.errors,
      title: '⚠️ 使用できないロールが指定されています',
      description: supportServerLink
    }),
    ungivenQuestion: () => ({
      color: DefaultColors.errors,
      title: '⚠️ 質問文が指定されていません',
      description: supportServerLink
    }),
    tooManyOptions: () => ({
      color: DefaultColors.errors,
      title: `⚠️ 選択肢が ${COMMAND_MAX_CHOICES} 個を超えています`,
      description: supportServerLink
    }),
    tooLongQuestion: () => ({
      color: DefaultColors.errors,
      title: `⚠️ 質問文が ${COMMAND_QUESTION_MAX} 文字を超えています`,
      description: supportServerLink
    }),
    tooLongOption: () => ({
      color: DefaultColors.errors,
      title: `⚠️ 選択肢が ${COMMAND_CHOICE_MAX} 文字を超えています`,
      description: supportServerLink
    }),
    duplicateEmojis: () => ({
      color: DefaultColors.errors,
      title: '⚠️ 絵文字が重複しています',
      description: supportServerLink
    }),
    unusableEmoji: () => ({
      color: DefaultColors.errors,
      title: '⚠️ 使用できない絵文字が含まれています',
      description: '以下のいずれかの理由により、BOTが絵文字を使用できません。\n'
        + `●\`${ja.permissionNames.USE_EXTERNAL_EMOJIS}\`権限がこのBOTにない\n`
        + '●絵文字があるサーバーにこのBOTが導入されていない\n\n'
        + supportServerLink
    }),
    unavailableExclusive: () => ({
      color: DefaultColors.errors,
      title: `⚠️ DMチャンネル内では${COMMAND_PREFIX}expollコマンドを使用できません`,
      description: supportServerLink
    }),
    ungivenMessageID: () => ({
      color: DefaultColors.errors,
      title: '⚠️ メッセージIDが指定されていません',
      description: supportServerLink
    }),
    notFoundChannel: () => ({
      color: DefaultColors.errors,
      title: '⚠️ 指定されたチャンネルIDがサーバー内から見つかりません',
      description: supportServerLink
    }),
    notFoundPoll: () => ({
      color: DefaultColors.errors,
      title: '⚠️ 指定されたメッセージIDのアンケートが見つかりません',
      description: supportServerLink
    }),
    missingFormatPoll: () => ({
      color: DefaultColors.errors,
      title: '⚠️ 指定されたアンケートはフォーマットが正しくありません',
      description: supportServerLink
    })
  },
  reports: {
    error: (executedCommand, traceTexts) => ({
      color: DefaultColors.reports,
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
