# leveldb_test

typescript で [leveldb](https://github.com/google/leveldb/blob/main/doc/index.md) をラップしている [level-ts](https://www.npmjs.com/package/level-ts) を用いて、簡易的な API を構築する。

## モチベーション

- 学習目的
- typescript で repository, service, controller を実装した API を作るにはどうしたらいいのだろう
- 作ってみる

## 使っている技術

- バージョン管理系
  - [NVM](https://github.com/nvm-sh/nvm#about)
  - NPM
- 実装系
  - typescript
  - [express](https://expressjs.com/ja/)
  - [level-ts](https://www.npmjs.com/package/level-ts)
  - [ESLint](https://eslint.org/)
  - [Prettier](https://prettier.io/)
- テスト
  - [jest](https://jestjs.io/ja/)
  - [supertest](https://www.npmjs.com/package/supertest)

## 今後

- [x] DI を用いてテストコードを書く
- [ ] Github Actions を使ってプルリク時にテストが動くようにする
- [ ] jest の coverage を 100% にする
- [ ] Nest.js が いい感じに MVC できるみたいなので、移行してみたい
