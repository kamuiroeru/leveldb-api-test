// db, repository, service のモックを作成する

import Level from 'level-ts'
import { LevelDbImpl } from '../src/repository'
import { PcServiceImpl } from '../src/service'

// モック化した db を作って repository を作成する
// 参考: https://jestjs.io/docs/es6-class-mocks#automatic-mock
jest.mock('level-ts') // モジュールルートで実施する必要がある
export const mockDb = new Level('')
export const mockRepo = new LevelDbImpl(mockDb)
export const mockService = new PcServiceImpl(mockRepo)
