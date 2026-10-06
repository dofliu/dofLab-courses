const _T={
"試算表與資料分析":"Spreadsheets & Data",
"先清理雜亂資料、讓 Claude 解釋公式，再做樞紐分析與圖表，接著認識 Claude in Excel，最後把數字變成洞察：這一集用家庭水電費、產線稼動率與風機 SCADA 資料，示範 Claude 怎麼陪你處理試算表。":"Clean up messy data, have Claude explain formulas, build pivot tables and charts, meet Claude in Excel, and finally turn numbers into insight: this episode uses household utility bills, production-line utilization and wind-turbine SCADA data to show how Claude works with spreadsheets.",
"類常見髒資料":"common data problems","4類常見髒資料":"4 common data problems","日期格式、空白、重複、單位不一致":"Mixed date formats, blanks, duplicates, inconsistent units",
"公式":"Formulas","逐步解說":"explained step by step","讓 Claude 說明每一段在算什麼":"Ask Claude what each part calculates",
"樞紐":"Pivot","與圖表":"and charts","彙總、分組後再畫成圖":"Summarize and group, then chart",
"Excel":"Excel","附加元件":"add-in","Excel附加元件":"Excel add-in","Claude in Excel 可回答問題並附儲存格引用":"Claude in Excel answers questions with cell citations",
"人核對":"People check","再採用":"then adopt","人核對再採用":"People check, then adopt","數字與結論由你抽查，設備動作由人員確認":"You spot-check numbers and conclusions; equipment actions are confirmed by staff",
"個人工作":"Personal Work","你":"You","生活":"Everyday","智慧自動化":"Smart automation","風能運維":"Wind O&M",
/* shot 1 */
"清理前（示意）":"Before cleaning (illustrative)","時間":"Time","溫度":"Temp","狀態":"Status",
"Claude 發現的問題":"Problems Claude found",
"日期格式不一":"Mixed date formats","統一成 年-月-日 時:分":"Unify to YYYY-MM-DD hh:mm",
"有空白":"Blank cells","標記為缺值，不自行填數":"Mark as missing; don't invent values",
"重複的列":"Duplicate rows","保留一列，其餘移除":"Keep one row, remove the rest",
"單位混用":"Mixed units","℉ 換算成 ℃，並標註":"Convert ℉ to ℃ and note it",
"清理後：5 列 → 4 列，1 列缺值已標記":"After cleaning: 5 rows → 4, 1 missing value flagged",
"確認規則，原始檔另存":"Confirm the rules; keep the original",
/* shot 2 */
"這個公式在算什麼？ =SUMIF(B:B,\"電費\",C:C)":"What does this formula calculate? =SUMIF(B:B,\"Electricity\",C:C)",
"它把 B 欄是「電費」的列挑出來，再把對應 C 欄的金額加總，結果就是這段期間的電費總額。":"It picks the rows where column B is \"Electricity\" and adds up the matching amounts in column C. The result is the total electricity bill for the period.",
"比對的欄":"Column to match","條件":"Condition","加總的欄":"Column to sum",
"家庭水電費（示意）":"Household utility bills (illustrative)","月份":"Month","類別":"Category","金額":"Amount",
"\"電費\"":"\"Electricity\"","1 月":"Jan","2 月":"Feb","3 月":"Mar","電費":"Electricity","水費":"Water","瓦斯":"Gas",
"驗算：1,280 + 1,150":"Check: 1,280 + 1,150","= 2,430（與公式結果一致）":"= 2,430 (matches the formula)",
"用示範資料驗算再採用":"Verify with sample data, then adopt",
/* shot 3 */
"原始紀錄（示意，節錄）":"Raw records (illustrative excerpt)","樞紐表：平均稼動率":"Pivot: average utilization","長條圖：中班平均":"Bar chart: mid-shift average",
"A 機":"Machine A","B 機":"Machine B","C 機":"Machine C","早班":"Day shift","中班":"Mid shift","晚班":"Night shift","早":"Day","中":"Mid","晚":"Night",
"C 機中班偏低，值得查原因":"Machine C mid shift is low; worth investigating",
/* shot 4 */
"Excel（示意）":"Excel (illustrative)","合計":"Total","儲存格 C4 出現錯誤":"Cell C4 shows an error",
"Claude 側邊欄":"Claude sidebar","這份表哪裡出錯？":"What's wrong in this sheet?",
"C4 的 #REF! 是因為公式引用的欄位被刪除。建議改成引用 C3 的格式（見儲存格 C3、E3）。":"The #REF! in C4 appears because a column the formula referred to was deleted. I suggest following the pattern in C3 (see cells C3 and E3).",
"附儲存格引用":"Cell citations","除錯":"Debugging","編輯樞紐表與圖表":"Edit pivots and charts",
"方案：Pro、Max、Team、Enterprise":"Plans: Pro, Max, Team, Enterprise","套用前先檢視改動":"Review changes before applying",
/* shot 5 */
"風速—功率（示意）":"Wind speed vs. power (illustrative)","風速 (m/s)":"Wind speed (m/s)","功率":"Power","偏低的點（示意）":"Low points (illustrative)",
"可利用率（示意）":"Availability (illustrative)","可用時數 ÷ 總時數":"Available hours ÷ total hours",
"故障碼次數排行（示意）":"Fault-code ranking (illustrative)","停機與上鎖掛牌由人員確認":"Shutdown and lockout/tagout confirmed by staff",
/* shot 6 */
"趨勢":"Trend","假設":"Hypothesis","下一步":"Next step",
"電費 1、2 月高於其他月份":"Electricity is higher in Jan and Feb","可能原因：冬季暖氣用電":"Possible cause: winter heating","下一步：比對電表與用電習慣":"Next: compare meter readings with usage habits",
"C 機中班稼動率偏低":"Machine C mid-shift utilization is low","可能原因：換線時間拉長":"Possible cause: longer changeovers","下一步：查換線紀錄與停機原因":"Next: check changeover logs and stop reasons",
"F101 集中在 3 台機組":"F101 clusters on 3 turbines","可能原因：同批零件或感測器":"Possible cause: same-batch parts or sensor","下一步：查維修紀錄，由人員現場確認":"Next: check maintenance records; staff confirm on site",
"Claude 給的是假設與建議，是否成立要回到原始資料與現場驗證":"Claude offers hypotheses and suggestions; verify them against raw data and on site",
"抽查資料，再決定行動":"Spot-check the data, then decide",
/* shot titles */
"清理雜亂資料":"Cleaning messy data","公式解說":"Explaining formulas","樞紐分析與圖表":"Pivot tables and charts","風機資料：功率曲線與故障碼":"Turbine data: power curve and fault codes","把數字變成洞察":"Turning numbers into insight",
/* subtitles */
"匯出的感測資料，格式不一":"Exported sensor data, inconsistent formats","Claude 列出問題與處理方式":"Claude lists the problems and the fixes","清理完成，原始檔另外保留":"Cleaned; the original file is kept",
"貼上看不懂的公式":"Paste a formula you can't read","Claude 逐段說明":"Claude explains it part by part","用示範資料驗算":"Verify with sample data",
"長串紀錄，看不出重點":"A long list hides the point","依機台與班別分組、彙總":"Group and summarize by machine and shift","畫成長條圖，找出落差":"Chart it and spot the gap",
"Excel 側邊欄，直接對活頁簿提問":"Ask the workbook directly from the Excel sidebar","答案附儲存格引用，能除錯與編輯":"Answers cite cells; it can debug and edit","改動前先檢視":"Review before changes",
"風速與功率散點，對照典型曲線":"Wind-speed/power scatter against a typical curve","算可利用率、統計故障碼":"Compute availability, count fault codes","分析與建議，停機由人員確認":"Analysis and advice; staff confirm any shutdown",
"先說趨勢，再列可能原因":"Trend first, then possible causes","三個情境的洞察與下一步":"Insights and next steps in three settings","假設由你查證，現場確認":"You verify the hypotheses and confirm on site",
/* descriptions */
"拿到產線感測資料匯出檔，常見的問題是日期格式不一、有空白欄位、重複的列，還有單位混用。把檔案交給 Claude，請它先檢查再清理：它會列出發現的問題，說明打算怎麼處理，清理後也會告訴你改了幾列。原始檔請另外保留，清理規則由你確認。":"Exported line-sensor data usually has mixed date formats, blank cells, duplicate rows and mixed units. Give the file to Claude and ask it to inspect first, then clean: it lists the problems, explains how it plans to fix them, and tells you how many rows changed. Keep the original file separately; you confirm the cleaning rules.",
"看不懂別人留下的公式，貼給 Claude 請它逐段解釋。以家庭水電費表為例，Claude 會說明這段公式是把「類別」欄等於「電費」的金額加總，再說明每個符號的作用。你也可以描述需求，請它幫你寫公式，並用幾筆示範資料驗算，確認結果和你預期的一致。":"If you can't read a formula someone left behind, paste it to Claude and ask for a part-by-part explanation. With a household utility table, Claude explains that it sums the amounts where Category equals Electricity, and what each symbol does. You can also describe what you need, ask it to write the formula, and verify it on a few sample rows.",
"一長串紀錄看不出重點，就用樞紐分析彙總。以三台機台、三個班別的稼動率示範資料為例，請 Claude 依機台與班別分組、算平均，再畫成長條圖。Claude 可以說明為什麼選這個欄位當分組、為什麼用平均。數字是示意，實際要以你的資料與計算定義為準。":"When a long list hides the point, summarize it with a pivot table. Using sample utilization data for three machines and three shifts, ask Claude to group by machine and shift, average, and chart the result. Claude can explain why it grouped by that field and why it averaged. Numbers are illustrative; your own data and definitions rule.",
"依 Claude 說明中心，Claude in Excel 是 Excel 的附加元件，適用於 Pro、Max、Team 與 Enterprise 方案。你可以在側邊欄對活頁簿提問，答案附上儲存格引用，方便回頭核對；也能更新假設、除錯，以及編輯樞紐表、圖表與條件式格式。它改動的範圍，請在套用前先看過。":"According to the Claude Help Center, Claude in Excel is an Excel add-in for Pro, Max, Team and Enterprise plans. Ask the workbook questions in the sidebar and get answers with cell citations you can check; it can also update assumptions, debug, and edit pivot tables, charts and conditional formatting. Review the scope of any change before you apply it.",
"風機 SCADA 匯出的資料量大，可請 Claude 整理三件事：畫出風速與功率的散點圖，比較典型功率曲線找出偏低的點；用公式算可利用率；再統計故障碼次數排行。數字為示意，真正的判讀要看機型與現場條件。Claude 提供分析與建議，停機與上鎖掛牌由現場人員確認。":"Turbine SCADA exports are large. Ask Claude for three things: a wind-speed/power scatter against a typical power curve to spot low points; availability calculated with a formula; and a ranking of fault-code counts. Numbers are illustrative; real interpretation depends on turbine model and site conditions. Claude gives analysis and advice; shutdown and lockout/tagout are confirmed by on-site staff.",
"整理出數字只是第一步，重點是回答「所以呢」。請 Claude 先說趨勢，再列出可能原因，最後提出下一步要驗證什麼。三個例子：水電費冬天偏高、C 機中班稼動率偏低、F101 故障碼集中在某幾台機組。Claude 給的是假設與建議，是否成立，要靠你抽查原始資料與現場確認。":"Getting the numbers is only the first step; the point is answering \"so what?\" Ask Claude for the trend, then possible causes, then what to verify next. Three examples: higher winter utility bills, low mid-shift utilization on Machine C, and fault code F101 clustering on a few turbines. Claude offers hypotheses and suggestions; you confirm them by spot-checking raw data and on site.",
"說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。Claude in Excel、分析工具與建立檔案功能依 Claude 說明中心（support.claude.com）整理，資訊截至 2026-10，方案與功能實際以官方最新說明為準。水電費、感測資料、稼動率、功率曲線與故障碼統計均為虛構的示意或典型範例，並非任何特定公司、機關或案場資料；AI 提供分析與建議，停機、上鎖掛牌與對 PLC 下指令等動作，一律由現場人員確認後執行。":"Note: this is an educational illustration; the interface is a redrawn schematic, not official screens. Claude in Excel, analysis and file-creation features are summarized from the Claude Help Center (support.claude.com), as of 2026-10; plans and features follow the latest official documentation. Utility bills, sensor data, utilization, power curves and fault-code counts are fictional, illustrative or typical examples, not data from any company, agency or site. AI provides analysis and advice; shutdown, lockout/tagout and commands to a PLC are always confirmed and carried out by on-site staff."
};
Object.keys(_T).forEach(k=>{DICT[k]=[_T[k],""];});
