---
name: verify-types
description: 确认 src/types/api.ts 与后端 schema 一致；如果不一致提示去后端跑 make sync-types
---

# /verify-types — 类型同步验证

触发时机：用户说「验证一下类型」「verify types」「前端编译挂了」「字段对不上」。

## 上下文

`src/types/api.ts` 是 tygo 从后端生成的，**前端永远不该手改**。如果发现报错：
- 字段名不对 / 类型不对 → 通常是后端没跑 sync-types
- import 失败 → 通常是文件被误删 / 路径不对

## 执行步骤

### Step 1：跑类型检查

```bash
npm run type-check
```

把所有报错收集起来，按错误类型分桶：
- `Property 'xxx' does not exist on type 'Yyy'` → 字段不一致
- `Cannot find module '@/types/api'` → 文件缺失或路径错
- `Type 'X' is not assignable to type 'Y'` → 字段类型变了

### Step 2：检查 types/api.ts 是否存在

```bash
ls src/types/api.ts
head -30 src/types/api.ts
```

如果文件不存在或为空 → 后端没跑过 `make sync-types`。

### Step 3：比对后端 schema

```bash
# 看后端最新的 schema
ls ../competify-backend/internal/schema/
head -50 ../competify-backend/internal/schema/types.go
```

肉眼比对前端 `types/api.ts` 是否包含后端定义的全部 export 类型。

### Step 4：提示用户去后端同步

如果字段对不上，告诉用户：

> 字段不一致。请切到后端跑：
> ```bash
> cd ../competify-backend && make sync-types
> ```
> 再回到前端跑 `npm run type-check`。

### Step 5：极少数情况 — 手动检查 tygo 输出

如果 tygo 生成的类型有问题（如把 `time.Time` 漏成 `any`）：
- 检查后端 `tygo.yaml` 的 `type_mappings`
- 不要手改 `types/api.ts`，回到后端调整 tygo 配置后重新生成

## 完成检查清单

- [ ] `npm run type-check` 输出收集了
- [ ] `types/api.ts` 文件存在且非空
- [ ] 已比对后端最新 schema
- [ ] 字段不匹配时已提示用户去后端 sync-types
- [ ] 没有手改 `types/api.ts`

## 反模式（禁止）

- ❌ 手动修改 `src/types/api.ts`（下次 sync 会覆盖）
- ❌ 用 `as any` 绕过类型报错（应该解决根因）
- ❌ 复制后端字段到前端单独写一份（破坏单一真相源）
