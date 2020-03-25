## 6.0.0 (2020-03-25)

-   build(deps-dev): bump prettier from 2.0.1 to 2.0.2 ([b414e27](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/b414e27))
-   build(deps): bump helmet from 3.21.3 to 3.22.0 ([84d2aea](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/84d2aea))
-   build(deps): bump sanitize-middleware from 2.0.3 to 2.0.4 ([c653dfc](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/c653dfc))
-   ci(travis): run jobs using linux ([e450610](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/e450610))
-   tests(middleware): update tests to reflect new argument ([f284b1e](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/f284b1e))
-   docs(middleware): update jsdoc tags to reflect new argument ([85215cb](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/85215cb))
-   docs(readme): remove mention of windows service deployment ([831e392](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/831e392))
-   docs(readme): reorder pm2 notes ([321379e](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/321379e))
-   refactor(middleware): make requiredproperties a separate argument ([0ad8501](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/0ad8501))
-   fix(middleware): add missing next function call ([734ca55](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/734ca55))
-   fix(middleware): pass errors to next function ([5147016](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/5147016))
-   chore(pm2): remove need to manually restart upon config change ([5c7df72](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/5c7df72))

### BREAKING CHANGE

-   obfuscateMiddleware function has a new `requiredProperties` argument that functions the same as `config.requiredProperties`.

## <small>5.0.5 (2020-03-23)</small>

-   ci(travis): add release tags to branch safelist ([f127cca](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/f127cca))
-   ci(travis): test osx ([3784034](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/3784034))
-   chore(package): add prettier call to changelog gen script ([f477e1c](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/f477e1c))
-   chore(package): use test-only script when testing ([6883a21](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/6883a21))
-   fix(server): add deep cloning when assigning config param ([bcbcf7c](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/bcbcf7c))
-   tests(server): remove superfluous console logs and throws ([0e18712](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/0e18712))
-   build(deps-dev): bump coveralls from 3.0.9 to 3.0.11 ([6d27d08](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/6d27d08))
-   build(deps-dev): bump eslint-config-prettier from 6.10.0 to 6.10.1 ([e7a76b0](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/e7a76b0))
-   build(deps-dev): bump prettier from 1.19.1 to 2.0.1 ([4d7dcd7](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/4d7dcd7))
-   build(deps): bump sanitize-middleware from 2.0.1 to 2.0.3 ([3b77d61](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/3b77d61))

## <small>5.0.4 (2020-03-16)</small>

-   build(deps-dev): bump eslint-plugin-json from 2.1.0 to 2.1.1 ([d66f23c](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/d66f23c))
-   build(deps): bump sanitize-middleware from 1.0.1 to 2.0.0 ([812a76f](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/812a76f))
-   build(deps): bump sanitize-middleware from 2.0.0 to 2.0.1 ([621fb56](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/621fb56))
-   chore: update dependencies ([051b6c2](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/051b6c2))
-   chore(config): rename config properties to reflect content ([3628f21](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/3628f21))
-   style: rename main file to index from app ([798caa2](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/798caa2))
-   refactor(config): change to use new sanitize middleware structure ([068790d](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/068790d))

## <small>5.0.3 (2020-03-12)</small>

-   chore: remove redundant image ([1e214b3](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/1e214b3))
-   chore: update lockfile ([a06e9f8](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/a06e9f8))
-   docs(readme): remove redundant sentence regarding pm2 service ([d0677d9](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/d0677d9))

## <small>5.0.2 (2020-03-10)</small>

-   docs(readme): clarify pm2 usage ([b61dccf](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/b61dccf))
-   docs(readme): remove redundant keycloak config section ([4272b59](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/4272b59))
-   chore: update lockfile ([fb89941](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/fb89941))
-   build(deps-dev): bump eslint-plugin-jest from 23.8.1 to 23.8.2 ([eb226a0](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/eb226a0))
-   build(deps): bump cross-env from 7.0.0 to 7.0.1 ([9b86043](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/9b86043))
-   build(deps): bump cross-env from 7.0.1 to 7.0.2 ([23c3bef](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/23c3bef))
-   build(deps): bump query-string from 6.11.0 to 6.11.1 ([8aa18b8](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/8aa18b8))
-   build(deps): bump sanitize-middleware from 1.0.0 to 1.0.1 ([e6b7ec6](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/e6b7ec6))
-   build(deps): move cross-env to dev dependencies ([9c51bee](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/9c51bee))

## <small>5.0.1 (2020-03-02)</small>

-   refactor(middleware): move sanitization middleware to own module ([5e00d49](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/5e00d49))
-   build(deps-dev): bump eslint-plugin-jest from 23.8.0 to 23.8.1 ([5e569ec](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/5e569ec))
-   build(deps-dev): bump typescript from 3.8.2 to 3.8.3 ([9214c96](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/9214c96))
-   docs(readme): remove winser steps ([caac519](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/caac519))
-   chore(deps): remove redundant winser dependency ([d754c21](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/d754c21))

## 5.0.0 (2020-02-26)

-   docs(readme): add pm2 windows service steps ([dfd2ef7](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/dfd2ef7))
-   feat(middleware): add validation and deriving to sanitize middleware ([d9e1537](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/d9e1537))
-   feat(server): add basic error handling ([8e9e143](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/8e9e143))
-   refactor(middleware): return entire error rather than just message ([d57b528](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/d57b528))
-   refactor(middleware): skip over keycloak request if test environment ([d002f06](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/d002f06))
-   tests(middleware): add basic keycloak middleware test ([a3cdd45](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/a3cdd45))
-   tests(middleware): test request go through keycloak middleware ([b0f8a2b](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/b0f8a2b))
-   build(deps): bump helmet from 3.21.2 to 3.21.3 ([4ad87fc](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/4ad87fc))
-   chore: shorten name of keycloak middleware ([70b1b62](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/70b1b62))
-   chore: stop sending error ([4595e5f](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/4595e5f))
-   chore(app): remove commented out keycloak middleware ([956d5dc](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/956d5dc))
-   chore(config): add type values ([451c2ea](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/451c2ea))
-   fix(middleware): change status_token param to access_token ([3f08fb4](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/3f08fb4))
-   fix(middleware): skip over keycloak middleware if config empty ([3efd1f5](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/3efd1f5))

### BREAKING CHANGE

-   keys in requiredParam object in config file now reference objects rather than strings

## <small>4.0.1 (2020-02-24)</small>

-   tests(middleware): add missing checks for next function calls ([0a45394](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/0a45394))
-   chore: add pm2 config file ([a57b2bc](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/a57b2bc))
-   chore: convert pm2 config file from yml to js ([6859e53](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/6859e53))
-   chore(config): add comment for example cert path ([d30c5b4](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/d30c5b4))
-   chore(config): add link to keycloak docs ([99f2b0c](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/99f2b0c))
-   chore(gitignore): remove ssl_certs from list ([01af8ab](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/01af8ab))
-   chore(prettierignore): add comment ([c33b5d6](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/c33b5d6))
-   build(deps-dev): bump eslint-plugin-jest from 23.7.0 to 23.8.0 ([a755db2](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/a755db2))
-   build(deps-dev): bump eslint-plugin-json from 2.0.1 to 2.1.0 ([a1e4afb](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/a1e4afb))
-   build(deps-dev): bump typescript from 3.7.5 to 3.8.2 ([cadd83a](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/cadd83a))
-   build(deps): bump express-winston from 4.0.2 to 4.0.3 ([e058aac](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/e058aac))
-   build(deps): bump query-string from 6.10.1 to 6.11.0 ([39e6cdd](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/39e6cdd))
-   build(deps): bump sanitize-html from 1.21.1 to 1.22.0 ([b182329](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/b182329))
-   docs(readme): add pm2 deployment section ([38c8ed5](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/38c8ed5))
-   docs(readme): change process manager link ([a74bde2](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/a74bde2))

## 4.0.0 (2020-02-12)

-   tests(middleware): add obfuscate middleware tests ([578ac12](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/578ac12))
-   tests(middleware): update tests to support sanitization middleware ([b53c32d](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/b53c32d))
-   tests(server): update server tests to accommodate listen function change ([ce7e98e](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/ce7e98e))
-   refactor(config): move obfuscation options to config file ([845e4dd](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/845e4dd))
-   refactor(middleware): add check for array ([e8efc31](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/e8efc31))
-   refactor(middleware): replace serialise function with query-string dep ([0f99979](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/0f99979))
-   refactor(server): move helmet middleware init to own function ([1801a7e](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/1801a7e))
-   refactor(server): move recieving endpoint string to config file ([67899f0](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/67899f0))
-   refactor(server): rename configureRoute function to configureRoutes ([80b8db8](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/80b8db8))
-   refactor(server): use name key value from package.json ([b5c27f7](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/b5c27f7))
-   feat(middleware): add sanitize middleware ([482e55b](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/482e55b))
-   feat(server): remove port param from listen function; add env port usage ([3c696df](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/3c696df))
-   chore(middleware): remove redundant code comment ([2b36cd5](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/2b36cd5))
-   chore(server): remove name key from defaultConfig ([4895975](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/4895975))
-   chore(server): reorder functions ([fabed6f](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/fabed6f))
-   style(server): alphabetically sort imports ([8c5e3c4](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/8c5e3c4))
-   build(deps-dev): bump eslint-plugin-jest from 23.6.0 to 23.7.0 ([8bd4c97](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/8bd4c97))
-   build(deps): bump request from 2.88.0 to 2.88.2 ([8aa767a](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/8aa767a))

### BREAKING CHANGE

-   `obfuscationConfig` object has been removed from config file, contents moved to `serverConfig.obfuscation`
-   `port` param for listen function of Server class removed

## <small>3.5.3 (2020-02-05)</small>

-   fix(package): remove cross-env from winser scripts ([4fa1717](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/4fa1717))
-   docs(changelog): fix concom style ([8d002d7](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/8d002d7))

## <small>3.5.2 (2020-02-05)</small>

-   refactor(config): reduce log files to daily rather than hourly ([d371f3d](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/d371f3d))
-   fix(config): fix name of log files generated ([bd3db4a](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/bd3db4a))
-   fix(server): remove reassigning config values ([2a08c25](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/2a08c25))

## <small>3.5.1 (2020-02-03)</small>

-   docs: refine test example ([c393217](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/c393217))
-   docs(contributing): punctuation fixes ([c17ad3c](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/c17ad3c))
-   docs(readme): move test section to contributing file ([0b21225](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/0b21225))
-   Bump eslint-config-prettier from 6.9.0 to 6.10.0 ([0b14fb2](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/0b14fb2))
-   Bump eslint-plugin-import from 2.20.0 to 2.20.1 ([e8d0423](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/e8d0423))
-   Bump jest from 24.9.0 to 25.1.0 ([5939b3b](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/5939b3b))
-   Update CHANGELOG.md ([c20f16d](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/c20f16d))
-   build(deps): make cross-env dep rather than devdep ([28c6b31](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/28c6b31))
-   build(scripts): change node_env to test for test scripts ([6fae67c](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/6fae67c))
-   chore: add prettierignore file ([96e9f90](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/96e9f90))
-   chore(eslint): remove redundant rules ([ef73b92](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/ef73b92))
-   perf: set node_env variables for test and production ([2e0d76b](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/2e0d76b))

## 3.5.0 (2020-01-24)

-   docs: add contributing guide ([c0e06c7](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/c0e06c7))
-   docs: declare yarn a non-optional prerequisite ([ae29921](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/ae29921))
-   docs(readme): add contributing link ([3180b2c](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/3180b2c))
-   test(server): add configureWinston function call ([8ed33b3](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/8ed33b3))
-   feat: add changelog generation ([35f1c16](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/35f1c16))
-   feat(server): add logging ([800a03c](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/800a03c))
-   chore(package): remove redundant config values ([e81105f](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/e81105f))
-   ci(travis): fix build config ([6ff75d0](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/6ff75d0))
-   Bump eslint-plugin-import from 2.19.1 to 2.20.0 ([e2ad6cc](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/e2ad6cc))
-   Bump eslint-plugin-jest from 23.3.0 to 23.6.0 ([e8837f1](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/e8837f1))
-   Bump typescript from 3.7.4 to 3.7.5 ([4b71c0c](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/4b71c0c))
-   Update dependencies ([99427fa](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/commit/99427fa))
