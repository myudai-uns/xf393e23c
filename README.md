# アイシン高丘東北 HP フォーマット準拠版 (v2)

アイシングループ公式フォーマット（グループロゴあり版）に準拠したHPです。

## 生成日
2026-04-21（初版）
2026-06-12（新フォーマット準拠化）

## ベース
`09_契約・テンプレート/グループロゴあり版テンプレート/(Unseeへ送るデータ)2_グループロゴあり版テンプレート/` を複製し、アイシン高丘東北向けにカスタマイズ。

2026-06-12、新版テンプレート `09_契約・テンプレート/2_グループロゴあり版テンプレート（企業ロゴがAISINでない場合）/formatB.static/` の変更点を適用：

- jQuery 3.5.1 → 3.7.1（`assets/js/jquery.min.js`、全27ページの参照を更新）
- `common.js` を新版に差し替え（廃止API `.size()` → `.length`）
- `main.js`：`breadcrumbMove()` 削除（新版準拠）。新版で追加されたGoogleカスタム検索 `runCSE()` は**検索機能を含めない方針のため移植しない**（2026-06-12決定）
- `search.html`：`#searchResultBox` をpageHeader直後（パンくず前）へ移動（新版準拠）
- 下層24ページのjQuery 1.8.2 CDN二重読み込みを撤去（`js/jquery.common.js` は3.7.1で動作、`a[href^=#]` セレクタはjQuery3対応で引用符付きに修正済み）

## フォーマット準拠チェックリスト

| 項目 | 対応 |
|---|---|
| `<header class="globalHeader">` | ✅ |
| `<div id="aisinLogo">`（メニュー右側固定） | ✅ |
| 企業ロゴ：左白背景（`.logo` > `logo.svg`） | ✅ |
| `<ul class="megaNavParent">` | ✅ |
| `<div class="megaNavSlide">` サブナビ | ✅（company / csr / recruit） |
| `tabDefault` クラス（下層ページ） | ✅ |
| `view-pc` / `view-notpc` 可視切替 | ✅ |
| CSS：`global.css` / `home.css` / `module.css` / `print.css` | ✅ |
| JS：`jquery.min.js`(3.7.1) / `main.js` / `common.js` / `home.js` | ✅ |
| Googleカスタム検索 `runCSE()`（新版main.js） | ―（検索機能は含めない方針のため対象外） |
| IE8対応：`html5shiv.min.js` / `css3-mediaqueries.js` | ✅ |
| `<body id="home" class="home">` ID/クラス付与 | ✅（各ページ section 名） |
| favicon.ico / apple_touch_icon.png ルート配置 | ✅ |
| assets/ ディレクトリ構成（css / img / js） | ✅ |
| ブレークポイント SP ~768 / tablet 768-992 / PC 993+ | ✅（テンプレ準拠） |
| footer構造（`#footer` / `#pageTop` / `.footInr`） | ✅ |
| ページトップリンク（`#pageTop > .scroll`） | ✅ |

## ディレクトリ構成

```
本番_v2_format準拠/
├── index.html                  # TOPページ
├── search.html                 # 検索（テンプレ同梱）
├── favicon.ico
├── apple_touch_icon.png
├── assets/
│   ├── css/ (global.css, home.css, module.css, print.css, slick.css, slick-theme.css)
│   ├── img/ (common, home, etc.)
│   └── js/  (jquery-3.5.1.min.js, main.js, home.js, common.js, html5shiv.min.js, css3-mediaqueries.js)
├── module/
│   └── index.html              # デザインモジュール参考ページ
├── company/
│   ├── index.html              # 会社案内TOP
│   ├── message.html            # ごあいさつ
│   ├── about.html              # 会社概要
│   ├── history.html            # 沿革
│   └── factory.html            # 工場案内
├── product/
│   └── index.html              # 製品TOP
├── csr/
│   ├── index.html              # CSR TOP
│   ├── csr.html                # 社会貢献
│   ├── environment.html        # 環境方針
│   ├── compliance.html         # コンプライアンス
│   └── privacy.html            # 個人情報保護方針
├── news/
│   └── index.html              # 新着情報一覧
└── recruit/
    ├── index.html              # 採用情報TOP
    ├── newgraduate.html        # 新卒採用
    └── Midcareer.html          # 中途採用
```

合計 **17 HTMLページ**（module/index.htmlとsearch.htmlを含む）。

## 残タスク（先方原稿・素材待ち）

- [ ] ごあいさつ本文（代表取締役社長メッセージ）
- [ ] 会社概要の数値（設立・資本金・従業員数等）
- [ ] 沿革データ
- [ ] 工場案内の文・写真
- [ ] 社会貢献/環境方針/コンプライアンス/個人情報保護方針の各本文
- [ ] 製品ページ詳細コンテンツ（現行HPのLity部分移植）
- [ ] 新卒採用・中途採用ページ本文
- [ ] アイシン高丘東北のロゴSVG最終版（現在は `本番/img/common/logo_at-t.svg` を流用）
- [ ] TOPページのメインビジュアル画像（assets/img/home/配下）
- [ ] OGP画像の更新（現在は `本番/img/common/og.png` 流用）
- [ ] apple_touch_icon.png をアイシン高丘東北版に差し替え（現在はテンプレート同梱のものを流用）
- [ ] 採用サブページ（appeal/work/people/lifestyle）の統合方針決定
- [ ] robots.txt / sitemap.xml / 404ページの追加
- [ ] Google Analytics の新タグ（現状 `js/google.analytics.js` は未移植）

## 既知の注意点

- メインビジュアルの背景画像（`#bg-slide` の slide01/02/03）はCSS側で定義されているため、`assets/img/home/` にテンプレート画像が残っています。アイシン高丘東北の写真に差し替えてください。
- news 一覧ページは現状静的HTML。動的化が必要な場合は別途検討。
- **検索機能は一切含めない方針**（2026-06-12決定）。`runCSE()` は移植せず、module/index.html にあった search.html への実リンクも撤去済み。`search.html` と空の `#siteSearch`/`#siteSearchSp` div（index.html / module/index.html）はテンプレート構造として残置しているが、どこからもリンクされておらず動作もしない。将来検索を入れる場合は新版テンプレートの `main.js` から `runCSE()` を移植し、自社用CSE ID（cx）を設定すること。
- 言語切替（langNav）は今回のメニューから一旦除外しています（EN/CN版が必要になれば復活）。
