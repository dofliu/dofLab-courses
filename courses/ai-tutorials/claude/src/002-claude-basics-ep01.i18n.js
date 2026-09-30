/* 002-claude-basics-ep01 — 英文／日文翻譯 */
Object.assign(DICT,{
/* 集數資訊 */
'Claude 是什麼':['What Is Claude','Claudeとは'],
'入門基礎':['Claude Basics','入門基礎'],
'Claude 是 Anthropic 開發的 AI 助理。本集說明語言模型怎麼一個字一個字產生回答、可以從哪些地方使用 Claude、不同模型與方案的差別，最後示範第一段對話。':
 ['Claude is an AI assistant built by Anthropic. This episode explains how a language model builds an answer one piece at a time, where you can use Claude, how the models and plans differ, and walks through a first conversation.',
  'ClaudeはAnthropicが開発したAIアシスタントです。本編では、言語モデルが回答を少しずつ生成する仕組み、Claudeを使える場所、モデルとプランの違いを説明し、最初の会話を実演します。'],
'個入口':['surfaces','つの入口'],
'網頁、桌面 App、手機 App，以及給開發者的 API':['Web, desktop app, mobile app, and the API for developers','Web、デスクトップアプリ、モバイルアプリ、開発者向けAPI'],
'tokens':['tokens','トークン'],
'Opus 5.5 與 Sonnet 5.5 的上下文視窗':['Context window of Opus 5.5 and Sonnet 5.5','Opus 5.5とSonnet 5.5のコンテキストウィンドウ'],
'個模型':['models','モデル'],
'目前最新模型：Haiku、Sonnet、Opus、Fable':['Latest models: Haiku, Sonnet, Opus, Fable','最新モデル：Haiku、Sonnet、Opus、Fable'],
'以上':['or more','以上'],
'Pro 方案相對 Free 的用量':['Pro usage compared with Free','Freeに対するProの利用量'],
'Max 方案相對 Pro 的用量選項':['Max usage options compared with Pro','Proに対するMaxの利用量オプション'],
'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，並非官方畫面或標誌。模型、方案與用量說明依 support.claude.com、platform.claude.com 與 claude.com/pricing 查證，各方案實際內容與用量依官方公告為準。資訊截至 2026-09。':
 ['Note: This is an educational illustration. Interfaces are redrawn schematics, not official screens or logos. Models, plans, and usage were checked against support.claude.com, platform.claude.com, and claude.com/pricing; official announcements prevail. Info as of 2026-09.',
  '注：本編は教育用の解説アニメーションです。画面は再描画した模式図で、公式の画面やロゴではありません。モデル・プラン・利用量はsupport.claude.com、platform.claude.com、claude.com/pricingで確認しました。詳細は公式発表に従います。情報は2026-09時点。'],

/* ① */
'語言模型如何預測下一個字':['How a model predicts the next word','言語モデルが次の語を予測する仕組み'],
'Claude 是一個大型語言模型。它在訓練時讀過大量文字，學會詞與詞之間的規律；回答時，它根據前面所有的內容，估計下一個詞元（token）出現的機率，挑出一個，再接著預測下一個。整段回答就是這樣一小段一小段接出來的。因為是依機率產生，同樣的問題換個說法，答案也可能略有不同。':
 ['Claude is a large language model. During training it read a vast amount of text and learned the patterns between words. When it answers, it looks at everything so far, estimates the probability of each possible next token, picks one, and then predicts the next. A whole answer is built this way, piece by piece. Because it is probabilistic, rewording the same question can give a slightly different answer.',
  'Claudeは大規模言語モデルです。学習時に大量の文章を読み、語と語の規則性を身につけました。回答時は、それまでの内容全体をもとに次のトークンの確率を見積もり、一つ選んでから次を予測します。回答はこうして少しずつつながっていきます。確率にもとづくため、同じ質問でも言い方を変えると答えが少し変わることがあります。'],
'輸入一句話：「今天天氣很」':['Input: "The weather today is…"','入力：「今日の天気はとても」'],
'模型估計每個候選詞的機率':['The model scores each candidate word','モデルが各候補の確率を見積もる'],
'選出「好」，接到句子後面':['It picks "nice" and appends it','「良い」を選んで文につなげる'],
'再根據新的句子預測下一個詞':['Then it predicts again from the new sentence','新しい文をもとに次の語を予測する'],
'下一個詞元的機率':['Next-token probability','次のトークンの確率'],
'今天天氣很':['The weather today is','今日の天気はとても'],
'好':['nice','良い'],
'，適合':[', good for','、ちょうど'],
'熱':['hot','暑い'],'冷':['cold','寒い'],'悶':['muggy','蒸し暑い'],
'出門':['going out','お出かけ日和'],'散步':['a walk','散歩日和'],'曬衣服':['laundry','洗濯日和'],'睡覺':['a nap','昼寝日和'],
'選出機率最高的一個':['Pick the most likely one','最も確率の高い語を選ぶ'],
'兩個階段':['Two stages','二つの段階'],
'訓練':['Training','学習'],'讀過大量文字，學會語言的規律':['Reads vast amounts of text and learns language patterns','大量の文章を読み、言葉の規則性を学ぶ'],
'回答':['Answering','回答'],'一次產生一個詞元，逐步接成句子':['Generates one token at a time to build sentences','トークンを一つずつ生成し、文を組み立てる'],
'依機率產生，所以每次回答可能略有不同':['Because it is probabilistic, answers can vary slightly','確率で生成するため、回答は毎回少し異なることがある'],

/* ② */
'一個 Claude，多個入口':['One Claude, many surfaces','一つのClaude、複数の入口'],
'同一個 Claude 可以從好幾個地方使用：在瀏覽器打開 claude.ai 的網頁版、安裝在電腦上的桌面 App、手機上的 iOS 與 Android App，以及讓開發者把 Claude 接進自己程式的 API。個人方案的用量在網頁、桌面與 Claude Code 之間共同計算，換裝置也能延續同一份對話紀錄。':
 ['The same Claude is available in several places: the web version at claude.ai in your browser, the desktop app on your computer, the iOS and Android apps on your phone, and the API that lets developers build Claude into their own software. On individual plans, usage is counted together across the web, desktop, and Claude Code, and your conversation history follows you across devices.',
  '同じClaudeを複数の場所で使えます。ブラウザで開くclaude.aiのWeb版、パソコンのデスクトップアプリ、スマートフォンのiOS・Androidアプリ、そして開発者が自分のプログラムにClaudeを組み込むためのAPIです。個人プランの利用量はWeb、デスクトップ、Claude Codeで合算され、端末を替えても同じ会話履歴を続けられます。'],
'中間是同一個 Claude':['The same Claude sits in the middle','中心にあるのは同じClaude'],
'網頁版：打開瀏覽器就能用':['Web: just open a browser','Web版：ブラウザを開くだけで使える'],
'桌面 App 與手機 App':['Desktop and mobile apps','デスクトップアプリとモバイルアプリ'],
'開發者透過 API 接進自己的程式':['Developers connect via the API','開発者はAPIで自分のプログラムに接続'],
'網頁版':['Web','Web版'],'桌面 App':['Desktop app','デスクトップ'],'手機 App':['Mobile app','モバイル'],
'個人用量共同計算':['Usage counted together','利用量は合算'],

/* ③ */
'模型家族：快速與深入':['The model family: fast to deep','モデルファミリー：速さと深さ'],
'Claude 不只一個模型。目前最新的有四種：Haiku 4.5 速度最快、成本最低；Sonnet 5.5 兼顧速度與能力；Opus 5.5 是多數工作的建議預設；Fable 5.1 能力最強，適合最困難的推理與長時間任務，但回應較慢。在付費方案中，可以從傳送鍵旁的選單切換模型、調整「投入程度（effort）」，並看到 Claude 回答前的思考過程。':
 ['Claude is more than one model. There are four latest models: Haiku 4.5 is the fastest and lowest cost; Sonnet 5.5 balances speed and capability; Opus 5.5 is the recommended default for most work; Fable 5.1 is the most capable, suited to the hardest reasoning and long-running tasks, but responds more slowly. On paid plans you can switch models and adjust effort from the menu next to the send button, and view the thinking Claude does before answering.',
  'Claudeには複数のモデルがあります。最新は4種類：Haiku 4.5は最速で低コスト、Sonnet 5.5は速度と能力のバランス型、Opus 5.5は多くの作業で推奨される既定モデル、Fable 5.1は最も高性能で難しい推論や長時間のタスク向けですが、応答は遅めです。有料プランでは送信ボタン横のメニューからモデルの切り替えや「エフォート」の調整ができ、回答前の思考過程も確認できます。'],
'四個模型，各有擅長':['Four models, each with strengths','4つのモデル、それぞれの得意分野'],
'越往右推理越深，回應也越慢':['Further right means deeper reasoning, slower replies','右ほど推論が深く、応答は遅い'],
'傳送鍵旁的選單可以切換模型':['Switch models from the menu by Send','送信ボタン横のメニューでモデルを切り替え'],
'投入程度決定每次回答要多仔細':['Effort sets how thorough each answer is','エフォートで回答の丁寧さを決める'],
'最快速':['Fastest','最速'],'速度與能力兼顧':['Speed plus capability','速度と能力の両立'],'多數工作的預設':['Default for most work','多くの作業の既定'],'能力最強':['Most capable','最高性能'],
'推理深度':['Reasoning depth','推論の深さ'],
'較快、較省':['Faster, cheaper','速い・低コスト'],'較深入、較慢':['Deeper, slower','深い・遅い'],
'傳送鍵旁的選單':['Menu next to Send','送信ボタン横のメニュー'],
'思考：開':['Thinking: on','思考：オン'],
'投入程度（effort）':['Effort','エフォート'],
'低':['Low','低め'],'中':['Medium','普通'],'高':['High','高め'],'最高':['Max','最大'],

/* ④ */
'方案與用量的概念':['Plans and usage','プランと利用量'],
'Claude 有免費的 Free 方案，也有付費的 Pro、Max，以及給團隊與企業的 Team、Enterprise。方案之間最大的差別是可用的量：Pro 約為 Free 的五倍以上，Max 可選 Pro 的五倍或二十倍。用量會在一段時間內累計、時間到就重置；對話越長、附加的檔案越大、選用的模型越強、投入程度越高，每則訊息用掉的量就越多。':
 ['Claude has a free plan, paid Pro and Max plans, and Team and Enterprise plans for organizations. The biggest difference between plans is how much you can use: Pro offers at least five times the usage of Free, and Max offers five or twenty times the usage of Pro. Usage adds up over a set period and then resets. Longer conversations, larger attachments, more powerful models, and higher effort all use more per message.',
  'Claudeには無料のFreeプラン、有料のPro・Max、チームや企業向けのTeam・Enterpriseがあります。プラン間の最大の違いは利用できる量で、ProはFreeの5倍以上、MaxはProの5倍または20倍を選べます。利用量は一定期間で積み上がり、期間が過ぎるとリセットされます。会話が長いほど、添付ファイルが大きいほど、高性能なモデルやエフォートが高いほど、1通あたりの消費が増えます。'],
'方案不同，可用的量不同':['Different plans, different usage','プランごとに使える量が違う'],
'Max 可選 Pro 的五倍或二十倍':['Max offers 5× or 20× Pro','MaxはProの5倍か20倍を選べる'],
'長對話、大檔案、強模型用量較多':['Long chats, big files, strong models use more','長い会話・大きなファイル・高性能モデルは消費が多い'],
'用量會在一段時間後重置':['Usage resets after a set period','利用量は一定期間後にリセット'],
'相對用量（示意）':['Relative usage (illustrative)','相対的な利用量（イメージ）'],
'基準':['Baseline','基準'],'Free ×5 以上':['Free ×5+','Free×5以上'],'Pro ×5':['Pro ×5','Pro×5'],'Pro ×20':['Pro ×20','Pro×20'],
'Team、Enterprise 另有團隊方案':['Team and Enterprise plans for organizations','組織向けにTeam・Enterpriseもある'],
'什麼會用掉比較多':['What uses more','消費が増えるもの'],
'長對話':['Long chats','長い会話'],'每次回覆都要重讀前文':['Each reply rereads the earlier text','毎回それまでの内容を読み直す'],
'大檔案':['Large files','大きなファイル'],'檔案內容也算進上下文':['File contents count toward context','ファイルの内容もコンテキストに入る'],
'較強的模型':['Stronger models','高性能なモデル'],'例如 Opus、Fable':['Such as Opus or Fable','OpusやFableなど'],
'較高的投入程度':['Higher effort','高いエフォート'],'思考越久，用量越多':['Longer thinking uses more','長く考えるほど消費が増える'],
'本期用量':['Usage this period','今期の利用量'],
'時間到自動重置':['Resets automatically','期間が過ぎると自動リセット'],
'用量（示意）':['Usage (demo)','利用量（例）'],'已使用':['Used','使用済み'],

/* ⑤ */
'第一段對話示範':['Your first conversation','最初の会話'],
'開始使用時，像對一位能幹的同事說話即可：說清楚想要什麼、給誰看、希望多長。這裡請 Claude 用三句話向國中生解釋光合作用；拿到回答後，再追問一個生活中的例子。Claude 會記得同一段對話前面說過的內容，所以追問時不必重講一次背景。回答若有不確定的地方，可以要求它說明依據。':
 ['To get started, talk to Claude as you would to a capable colleague: say what you want, who it is for, and how long it should be. Here we ask Claude to explain photosynthesis to middle schoolers in three sentences, then follow up by asking for an everyday example. Claude remembers what was said earlier in the same conversation, so you do not need to repeat the background. If anything seems uncertain, ask it to explain its basis.',
  '使い始めは、有能な同僚に話しかけるように伝えれば十分です。何がほしいか、誰向けか、どのくらいの長さかをはっきりさせます。ここではClaudeに中学生向けに光合成を3文で説明してもらい、続けて身近な例を尋ねます。Claudeは同じ会話で話した内容を覚えているので、背景を繰り返す必要はありません。不確かな点があれば根拠の説明を求めましょう。'],
'說清楚：主題、對象、長度':['Be clear: topic, audience, length','はっきり伝える：テーマ・対象・長さ'],
'Claude 一段一段地產生回答':['Claude builds the answer piece by piece','Claudeが回答を少しずつ生成する'],
'追問時不用重講背景':['No need to repeat the background','追加の質問では背景を繰り返さなくてよい'],
'同一段對話會記得前面的內容':['It remembers earlier turns in the chat','同じ会話の内容は覚えている'],
'用三句話向國中生解釋光合作用':['Explain photosynthesis to middle schoolers in three sentences','中学生向けに光合成を3文で説明して'],
'植物用葉子吸收陽光，把水和二氧化碳變成養分（葡萄糖），同時放出氧氣。':['Plants absorb sunlight with their leaves. They turn water and carbon dioxide into food (glucose). At the same time, they release oxygen.','植物は葉で日光を吸収します。水と二酸化炭素から養分（ブドウ糖）を作ります。同時に酸素を放出します。'],
'再舉一個生活中的例子':['Give me an everyday example','身近な例を一つ挙げて'],
'窗邊的盆栽會朝向陽光生長，因為它需要光來製造養分。':['A potted plant by the window grows toward the sunlight, because it needs light to make food.','窓辺の鉢植えは日光のほうへ伸びます。養分を作るのに光が必要だからです。'],
'光合作用說明':['Photosynthesis','光合成の説明'],
'再舉一個…':['Give me an…','身近な例を…'],
'輸入訊息…':['Type a message…','メッセージを入力…'],
'新對話':['New chat','新しいチャット'],
'模型選單':['Model menu','モデルメニュー'],

/* ⑥ */
'用好 Claude 的三個習慣':['Three habits for using Claude well','Claudeを上手に使う3つの習慣'],
'剛開始使用 Claude，記住三件事就很夠用：第一，說清楚目標、對象與格式；第二，把回答當作草稿，重要的事實、數字與引用要自己查證；第三，不滿意就追問或請它修改，通常兩三輪就會更貼近需求。後面幾集會分別深入提示詞、上下文、檔案、搜尋、Artifacts 與查證。':
 ['When you are new to Claude, three habits go a long way. First, state your goal, audience, and format clearly. Second, treat answers as drafts and verify important facts, numbers, and citations yourself. Third, if you are not satisfied, follow up or ask for changes; two or three rounds usually get closer to what you need. Later episodes go deeper into prompts, context, files, search, Artifacts, and verification.',
  'Claudeを使い始めたら、3つのことを覚えておけば十分です。第一に、目的・対象・形式をはっきり伝える。第二に、回答は下書きとして扱い、重要な事実・数字・引用は自分で確認する。第三に、満足できなければ追加で質問したり修正を頼んだりする。2〜3回のやり取りで要望に近づくことが多いです。以降の回ではプロンプト、コンテキスト、ファイル、検索、Artifacts、検証を詳しく扱います。'],
'第一：說清楚目標、對象與格式':['First: state goal, audience, format','第一：目的・対象・形式をはっきり'],
'第二：重要內容自己查證':['Second: verify what matters','第二：重要な内容は自分で確認'],
'第三：不滿意就追問修改':['Third: follow up and revise','第三：満足できなければ追加で質問'],
'說清楚':['Be clear','はっきり伝える'],'目標、對象、格式與長度':['Goal, audience, format, length','目的・対象・形式・長さ'],
'查證':['Verify','確認する'],'事實、數字與引用要核對':['Check facts, numbers, citations','事実・数字・引用を照合'],
'追問':['Follow up','追加で質問'],'請它修改，兩三輪更貼近需求':['Ask for changes; 2–3 rounds get closer','修正を頼む。2〜3回で要望に近づく'],
'下一集：好提示詞的五個要素':['Next: Five elements of a good prompt','次回：良いプロンプトの5つの要素'],
});
