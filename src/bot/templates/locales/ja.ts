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
  BOT_INVITE_URL,
} from '../../../constants';

const supportServerLink = `[ご質問・不具合の報告・要望はこちらへ](${SUPPORT_SERVER_URL})`;
const botDocumentURL = `${BOT_DOCUMENT_URL}/ja`;

export const ja: LocaleStructure = {
  permissionNames: {
    CreateInstantInvite: '招待を作成',
    KickMembers: 'メンバーをキック',
    BanMembers: 'メンバーをBAN',
    Administrator: '管理者',
    ManageChannels: 'チャンネルの管理',
    ManageGuild: 'サーバー管理',
    AddReactions: 'リアクションの追加',
    ViewAuditLog: '監査ログを表示',
    PrioritySpeaker: '優先スピーカー',
    Stream: 'WEB カメラ',
    ViewChannel: 'チャンネルを見る',
    SendMessages: 'メッセージを送信',
    SendTTSMessages: 'テキスト読み上げメッセージを送信する',
    ManageMessages: 'メッセージの管理',
    EmbedLinks: '埋め込みリンク',
    AttachFiles: 'ファイルを添付',
    ReadMessageHistory: 'メッセージ履歴を読む',
    MentionEveryone: '@everyone、@here、全てのロールにメンション',
    UseExternalEmojis: '外部の絵文字を使用する',
    ViewGuildInsights: 'サーバーインサイトを見る',
    Connect: '接続',
    Speak: '発言',
    MuteMembers: 'メンバーをミュート',
    DeafenMembers: 'メンバーのスピーカーをミュート',
    MoveMembers: 'メンバーを移動',
    UseVAD: '音声検出を使用',
    ChangeNickname: 'ニックネームの変更',
    ManageNicknames: 'ニックネームの管理',
    ManageRoles: 'ロールの管理',
    ManageWebhooks: 'ウェブフックの管理',
    ManageEmojisAndStickers: '絵文字・スタンプの管理',
    ManageGuildExpressions: 'サーバーエクスプレッションの管理',
    UseApplicationCommands: 'アプリコマンドを使う',
    RequestToSpeak: 'スピーカー参加をリクエスト',
    ManageEvents: 'イベントの管理',
    ManageThreads: 'スレッドの管理',
    CreatePublicThreads: '公開スレッドの作成',
    CreatePrivateThreads: 'プライベートスレッドの作成',
    UseExternalStickers: '外部のスタンプを使用する',
    SendMessagesInThreads: 'スレッドでメッセージを送信',
    UseEmbeddedActivities: 'ユーザーアクティビティ',
    ModerateMembers: 'メンバーをタイムアウト',
    ViewCreatorMonetizationAnalytics: 'クリエイターマネタイズアナリティクスを見る',
    UseSoundboard: 'サウンドボードを使用',
    UseExternalSounds: '外部のサウンドの使用',
    SendVoiceMessages: 'ボイスメッセージを送信',
    CreateGuildExpressions: 'エクスプレッションを作成',
    CreateEvents: 'イベントを作成',
    SendPolls: '投票の作成',
    UseExternalApps: '外部のアプリを使用'
  },
  loadings: {
    poll: exclusive => ({
      color: exclusive ? COLORS.EXPOLL : COLORS.POLL,
      title: '⌛ アンケート生成中...'
    })
  },
  successes: {
    help: () => ({
      color: COLORS.HELP,
      title: '📊 Quick Pollの使い方',
      url: botDocumentURL,
      description: '# <t:1743433199:D> でサービス終了\n'
        + 'アンケートを作成し、投票を募ることができるBOTです。\n'
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
            + `● 投票の選択肢は最大${COMMAND_MAX_CHOICES}個まで\n`
            + '● 文・絵文字の区切りは半角スペースか改行\n'
            + '● 半角スペースを含めたい場合 "" で文を囲む\n'
            + '● 画像を添付すると画像付きの投票を作成\n'
            + '● アンケートを編集したい場合コマンドを編集\n'
            + '```'
        },
        {
          name: `↩️ でコマンドをキャンセル(${COMMAND_EDITABLE_TIME / 60 / 1000}分以内)`,
          value: `➡️ **[サーバーへ追加](${BOT_INVITE_URL})**\n`
            + `⚠️ ${supportServerLink}\n`
            + `💟 **[運営資金を支援しませんか？(1口50円から)](${DONATION_SERVICE_URL})**`
        }
      ]
    }),
    poll: (
      exclusive, authorIconURL, authorName, question, selectors, choices, imageName, channelID, messageID
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
        value: `📊 \`${COMMAND_PREFIX}sumpoll ${messageID}\``
          + `\n[集計コマンドをコピー](${botDocumentURL}/sumpoll.html?channel_id=${channelID}&message_id=${messageID})`,
      }],
      footer: {
        text: `選択肢にリアクションで${exclusive ? '1人1票だけ' : ''}投票できます`
      },
      image: imageName ? { url: `attachment://${imageName}` } : undefined
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
        + `●\`${ja.permissionNames.UseExternalEmojis}\`権限がこのBOTにない\n`
        + '●絵文字があるサーバーにこのBOTが導入されていない\n\n'
        + supportServerLink
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
    }),
    unavailableExport: () => ({
      color: DefaultColors.errors,
      title: `⚠️ ${COMMAND_PREFIX}csvpollはコマンド編集で使用できません`,
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
          name: `バックトレース${i + 1}`,
          value: `\`\`\`${text}\`\`\``
        }));
      }
    })
  }
};
