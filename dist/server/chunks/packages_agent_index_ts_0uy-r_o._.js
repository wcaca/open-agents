module.exports=[118447,645825,567754,628927,374106,633484,463822,698129,e=>{"use strict";var t=e.i(415859),i=e.i(712075),o=e.i(750227),s=e.i(902157),n=o.default.join(process.cwd(),".devtools"),r=o.default.join(n,"generations.json"),a=process.env.AI_SDK_DEVTOOLS_PORT?parseInt(process.env.AI_SDK_DEVTOOLS_PORT):4983;function l(e){return"object"==typeof e&&null!==e&&!Array.isArray(e)}function c(e,t){let i={...e};for(let[e,o]of Object.entries(t)){let t=i[e];if(l(t)&&l(o)){i[e]=c(t,o);continue}i[e]=o}return i}function d(e,o={}){var s,n;let r,a,{devtools:l=!1,config:u,providerOptionsOverrides:p}=o,h=(u?(0,t.createGateway)({baseURL:u.baseURL,apiKey:u.apiKey}):t.gateway)(e),m=(s=e,n=p,r={},s.startsWith("anthropic/")&&(r.anthropic=s.includes("4.6")?{effort:"medium",thinking:{type:"adaptive"}}:{thinking:{type:"enabled",budgetTokens:8e3}}),s.startsWith("openai/")&&(r.openai={store:!1}),s.startsWith("openai/gpt-5")&&(r.openai=c(r.openai??{},{reasoningSummary:"detailed",include:["reasoning.encrypted_content"]})),s.startsWith("openai/gpt-5.4")&&(r.openai=c(r.openai??{},{textVerbosity:"low"})),a=function(e,t){if(!t||0===Object.keys(t).length)return e;let i={...e};for(let[e,o]of Object.entries(t)){let t=i[e];if(!t){i[e]=o;continue}i[e]=c(t,o)}return i}(r,n),s.startsWith("openai/")&&(a.openai=c(a.openai??{},{store:!1})),a);return Object.keys(m).length>0&&(h=(0,i.wrapLanguageModel)({model:h,middleware:(0,i.defaultSettingsMiddleware)({settings:{providerOptions:m}})})),l&&(h=(0,i.wrapLanguageModel)({model:h,middleware:(()=>{throw Error("@ai-sdk/devtools should not be used in production. Remove devToolsMiddleware from your model configuration for production builds.")})()})),h}e.s(["gateway",0,d],645825);var u=e.i(469719);let p={anthropic:{cacheControl:{type:"ephemeral"}}};function h({tools:e,messages:t,model:i,providerOptions:o=p}){if(!("string"==typeof i?i.includes("anthropic")||i.includes("claude"):"anthropic"===i.provider||i.provider.includes("anthropic")||i.modelId.includes("anthropic")||i.modelId.includes("claude")))return e??t;if(void 0!==e){let t=Object.entries(e);if(0===t.length)return e;let i=t.length-1;return Object.fromEntries(t.map(([e,t],s)=>[e,s===i?{...t,providerOptions:{...t.providerOptions,...o}}:t]))}if(void 0!==t)return 0===t.length?t:t.map((e,i)=>i===t.length-1?{...e,providerOptions:{...e.providerOptions,...o}}:e);throw Error("Either tools or messages must be provided")}var m=e.i(62789),f=e.i(814747);e.i(394991);var g=e.i(264543);function y(e){return"object"==typeof e&&null!==e&&"sandbox"in e&&"model"in e}function b(e,t){let i,o,s=f.isAbsolute(e)?f.resolve(e):f.resolve(t,e);if(i=f.resolve(s),o=f.resolve(t),!i.startsWith(o+f.sep)&&i!==o)return s.replace(/\\/g,"/");let n=f.relative(t,s);return""===n?".":n.replace(/\\/g,"/")}async function k(e,t){let i=y(e)?e:void 0;if(!i?.sandbox){let e=t?` (tool: ${t})`:"",o=i?`Context exists but sandbox is missing. Context keys: ${Object.keys(i).join(", ")}`:"Context is undefined or null";throw Error(`Sandbox not initialized in context${e}. ${o}. Ensure the agent's prepareCall sets experimental_context: { sandbox, ... }`)}return(0,g.connectSandbox)(i.sandbox.state)}function w(e){return"'"+e.replace(/'/g,"'\\''")+"'"}let v=u.z.object({command:u.z.string().describe("The bash command to execute"),cwd:u.z.string().optional().describe("Workspace-relative working directory for the command (e.g., apps/web)"),detached:u.z.boolean().optional().describe("Use this whenever you want to run a persistent server in the background (e.g., npm run dev, next dev). The command starts and returns immediately without waiting for it to finish.")}),x=[/\brm\s+-rf\b/],T=e=>(0,m.tool)({needsApproval:async t=>!!function(e){let t=e.trim();for(let e of x)if(e.test(t))return!0;return!1}(t.command)&&("function"==typeof e?.needsApproval?e.needsApproval(t):e?.needsApproval??!0),description:`Execute a bash command in the user's shell (non-interactive).

WHEN TO USE:
- Running existing project commands (build, test, lint, typecheck)
- Using read-only CLI tools (git status, git diff, ls, etc.)
- Invoking language/package managers (npm, pnpm, yarn, pip, go, etc.) as part of the task

WHEN NOT TO USE:
- Reading files (use readFileTool instead)
- Editing or creating files (use editFileTool or writeFileTool instead)
- Searching code or text (use grepTool and/or globTool instead)
- Interactive commands (shells, editors, REPLs)

USAGE:
- Runs bash -c "<command>" in a non-interactive shell (no TTY/PTY)
- Commands automatically run in the working directory by default — do NOT prepend "cd /path &&" to commands
- NEVER prefix commands with "cd <working-directory> &&" or any path — this is the most common mistake and is always wrong
- Use the cwd parameter ONLY with a workspace-relative subdirectory when you need to run in a different directory
- Commands automatically timeout after ~2 minutes
- Combined stdout/stderr output is truncated after ~50,000 characters

DO NOT USE FOR:
- File reading (cat, head, tail) - use readFileTool
- File editing (sed, awk, editors) - use editFileTool / writeFileTool
- File creation (touch, redirections like >, >>) - use writeFileTool
- Code search (grep, rg, ag) - use grepTool

IMPORTANT:
- Never chain commands with ';' or '&&' - use separate tool calls for each logical step
- Never use interactive commands (vim, nano, top, bash, ssh, etc.)
- Always quote file paths that may contain spaces
- Use detached: true to start dev servers or other long-running processes in the background

EXAMPLES:
- Run the test suite: command: "npm test"
- Check git status: command: "git status --short"
- List files in src: command: "ls -la", cwd: "src"
- Start a dev server: command: "npm run dev", detached: true`,inputSchema:v,execute:async({command:e,cwd:t,detached:i},{experimental_context:o,abortSignal:s})=>{let n=await k(o,"bash"),r=n.workingDirectory,a=t?f.isAbsolute(t)?t:f.resolve(r,t):r;if(i){if(!n.execDetached)return{success:!1,exitCode:null,stdout:"",stderr:"Detached mode is not supported in this sandbox environment. Only cloud sandboxes support background processes."};try{let{commandId:t}=await n.execDetached(e,a);return{success:!0,exitCode:null,stdout:`Process started in background (command ID: ${t}). The server is now running.`,stderr:""}}catch(e){return{success:!1,exitCode:null,stdout:"",stderr:e instanceof Error?e.message:String(e)}}}let l=await n.exec(e,a,12e4,{signal:s});return{success:l.success,exitCode:l.exitCode,stdout:l.stdout,stderr:l.stderr,...l.truncated&&{truncated:!0}}}}),S=u.z.object({pattern:u.z.string().describe("Glob pattern to match (e.g., '**/*.ts')"),path:u.z.string().optional().describe("Workspace-relative base directory to search from (e.g., src)"),limit:u.z.number().optional().describe("Maximum number of results. Default: 100")}),E=()=>(0,m.tool)({description:`Find files matching a glob pattern.

WHEN TO USE:
- Locating files by extension or naming pattern (e.g., all *.test.ts files)
- Discovering where components, migrations, or configs live
- Getting a quick list of recently modified files of a given type

WHEN NOT TO USE:
- Searching inside file contents (use grepTool instead)
- Reading file contents (use readFileTool instead)
- Arbitrary directory listings (bashTool with ls may be more appropriate)

USAGE:
- Supports patterns like "**/*.ts", "src/**/*.js", "*.json"
- Returns FILES (not directories) sorted by modification time (newest first)
- Skips hidden files (names starting with ".") and node_modules
- If path is omitted, the current working directory is used as the base
- Use workspace-relative paths when setting path
- Results are limited by the limit parameter (default: 100)

IMPORTANT:
- Patterns are matched primarily on the final path segment (file name), with basic "*" and "**" support
- Use this to narrow down candidate files before calling readFileTool or grepTool

EXAMPLES:
- All TypeScript files in the project: pattern: "**/*.ts"
- All Jest tests under src: pattern: "src/**/*.test.ts"
- Recent JSON config files: pattern: "*.json", path: "config", limit: 20`,inputSchema:S,execute:async({pattern:e,path:t,limit:i=100},{experimental_context:o,abortSignal:s})=>{let n=await k(o,"glob"),r=n.workingDirectory;try{let o,a;o=t?f.isAbsolute(t)?t:f.resolve(r,t):r;let l=e.split("/").filter(Boolean),c=l[l.length-1]??"*",d=[];for(let e=0;e<l.length-1;e++){let t=l[e];if(t.includes("*")||t.includes("?")||t.includes("["))break;d.push(t)}d.length>0&&(o=f.join(o,...d));let u=l.slice(d.length,l.length-1);u.some(e=>"**"===e)||"**"===c||(a=u.length+1);let p=["find",w(o)];void 0!==a&&p.push("-maxdepth",String(a)),p.push("-not","-path","'*/.*'","-not","-path","'*/node_modules/*'","-type","f","-name",w(c));let h=p.join(" "),m=`{ ${h} -printf '%T@\\t%s\\t%p\\n' 2>/dev/null || ${h} -print0 | xargs -0 stat -f '%m%t%z%t%N' ; } | sort -t$'\\t' -k1 -rn | head -n ${i}`,g=await n.exec(m,n.workingDirectory,3e4,{signal:s});if(!g.success&&1!==g.exitCode)return{success:!1,error:`Glob failed (exit ${g.exitCode}): ${g.stdout.slice(0,500)}`};let y=[];for(let e of g.stdout.split("\n").filter(Boolean)){let t=e.indexOf("	");if(-1===t)continue;let i=e.indexOf("	",t+1);if(-1===i)continue;let o=parseFloat(e.slice(0,t)),s=parseInt(e.slice(t+1,i),10),n=e.slice(i+1);!(isNaN(o)||isNaN(s))&&n&&y.push({path:b(n,r),size:s,modifiedAt:1e3*o})}let k={success:!0,pattern:e,baseDir:b(o,r),count:y.length,files:y.map(e=>({path:e.path,size:e.size,modifiedAt:new Date(e.modifiedAt).toISOString()}))};return 0===y.length&&(k._debug={command:m,exitCode:g.exitCode,stdoutPreview:g.stdout.slice(0,500)}),k}catch(t){let e=t instanceof Error?t.message:String(t);return{success:!1,error:`Glob failed: ${e}`}}}}),A=u.z.object({pattern:u.z.string().describe("Regex pattern to search for"),path:u.z.string().describe("Workspace-relative file or directory to search in (e.g., src)"),glob:u.z.string().optional().describe("Glob pattern to filter files (e.g., '*.ts')"),caseSensitive:u.z.boolean().optional().describe("Case-sensitive search. Default: true")}),I=()=>(0,m.tool)({description:`Search for patterns in files using POSIX Extended Regular Expressions (ERE).

WHEN TO USE:
- Finding where a function, variable, or string literal is used
- Locating configuration keys, routes, or error messages across files
- Narrowing down which files to read or edit

WHEN NOT TO USE:
- Simple filename-only searches (use globTool instead)
- Complex, multi-round codebase exploration (use taskTool with detailed instructions)
- Directory listings, builds, or other shell tasks (use bashTool instead)

USAGE:
- Uses POSIX ERE syntax (e.g., "log.*Error", "function[[:space:]]+[a-zA-Z_]+")
- Perl-style shorthands like \\s, \\w, \\d are NOT supported; use POSIX classes instead: [[:space:]], [[:alnum:]_], [[:digit:]]
- Search a specific file OR an entire directory via the path parameter
- Use workspace-relative paths for path (e.g., "src")
- Optionally filter files with glob (e.g., "*.ts", "*.test.js")
- Matches are SINGLE-LINE: patterns do not span across newline characters
- Results are limited to 100 matches total, with up to 10 matches per file; each match line is truncated to 200 characters

IMPORTANT:
- ALWAYS use this tool for code/content searches instead of running grep/rg via bashTool
- Use caseSensitive: false for case-insensitive searches
- Hidden files and node_modules are skipped when searching directories

EXAMPLES:
- Find all TODO comments in TypeScript files: pattern: "TODO", path: "src", glob: "*.ts"
- Find all references to a function (case-insensitive): pattern: "handleRequest", path: "src", caseSensitive: false`,inputSchema:A,execute:async({pattern:e,path:t,glob:i,caseSensitive:o=!0},{experimental_context:s,abortSignal:n})=>{let r=await k(s,"grep"),a=r.workingDirectory;try{let s=f.isAbsolute(t)?t:f.resolve(a,t),l=["grep","-rn"];o||l.push("-i"),l.push(`--exclude-dir=${w(".*")}`,`--exclude-dir=${w("node_modules")}`),i&&l.push(`--include=${w(i)}`),l.push("-m",String(10),"-E",w(e),w(s));let c=l.join(" "),d=await r.exec(c,r.workingDirectory,3e4,{signal:n});if(!d.success&&1!==d.exitCode){let e=(d.stderr||d.stdout).slice(0,500);return{success:!1,error:`Grep failed (exit ${d.exitCode}): ${e}`}}let u=[],p=new Set,h=new Map;for(let e of d.stdout.split("\n").filter(Boolean)){let t,i;if(u.length>=100)break;let o=e.indexOf("\0");if(-1!==o)t=e.slice(0,o),i=e.slice(o+1);else{let o=e.match(/:(\d+):/);if(!o||void 0===o.index)continue;t=e.slice(0,o.index),i=e.slice(o.index+1)}let s=i.indexOf(":");if(-1===s)continue;let n=parseInt(i.slice(0,s),10),r=i.slice(s+1);if(isNaN(n))continue;let l=b(t,a);p.add(l);let c=h.get(l)??0;c>=10||(h.set(l,c+1),u.push({file:l,line:n,content:r.slice(0,200)}))}let m={success:!0,pattern:e,matchCount:u.length,filesWithMatches:p.size,matches:u};return 0===u.length&&(m._debug={command:c,exitCode:d.exitCode,stdoutPreview:d.stdout.slice(0,500)}),m}catch(t){let e=t instanceof Error?t.message:String(t);return{success:!1,error:`Grep failed: ${e}`}}}});var O=e.i(522734);let C=u.z.object({filePath:u.z.string().describe("Workspace-relative path to the file to read (e.g., src/index.ts)"),offset:u.z.number().optional().describe("Line number to start reading from (1-indexed)"),limit:u.z.number().optional().describe("Maximum number of lines to read. Default: 2000")}),U=()=>(0,m.tool)({description:`Read a file from the filesystem.

USAGE:
- Use workspace-relative paths (e.g., "src/index.ts")
- Paths are resolved from the workspace root
- By default reads up to 2000 lines starting from line 1
- Use offset and limit for long files (both are line-based, 1-indexed)
- Results include line numbers starting at 1 in "N: content" format

IMPORTANT:
- Always read a file at least once before editing it with the edit/write tools
- This tool can only read files, not directories - attempting to read a directory returns an error
- You can call multiple reads in parallel to speculatively load several files

EXAMPLES:
- Read an entire file: filePath: "src/index.ts"
- Read a slice of a long file: filePath: "logs/app.log", offset: 500, limit: 200`,inputSchema:C,execute:async({filePath:e,offset:t=1,limit:i=2e3},{experimental_context:o})=>{let s=await k(o,"read"),n=s.workingDirectory;try{let o=function(e,t){let i=f.isAbsolute(e)?e:f.resolve(t,e);try{O.accessSync(i)}catch{if(e.startsWith("/")&&!e.startsWith("/Users/")&&!e.startsWith("/home/")){let o=f.join(t,e);try{O.accessSync(o),i=o}catch{}}}return i}(e,n);if((await s.stat(o)).isDirectory())return{success:!1,error:"Cannot read a directory. Use glob or ls command instead."};let r=(await s.readFile(o,"utf-8")).split("\n"),a=Math.max(1,t)-1,l=Math.min(r.length,a+i),c=r.slice(a,l).map((e,t)=>`${a+t+1}: ${e}`);return{success:!0,path:b(o,n),totalLines:r.length,startLine:a+1,endLine:l,content:c.join("\n")}}catch(t){let e=t instanceof Error?t.message:String(t);return{success:!1,error:`Failed to read file: ${e}`}}}}),N=u.z.object({filePath:u.z.string().describe("Workspace-relative path to the file to write (e.g., src/user.test.ts)"),content:u.z.string().describe("Content to write to the file")}),R=u.z.object({filePath:u.z.string().describe("Workspace-relative path to the file to edit (e.g., src/auth.ts)"),oldString:u.z.string().describe("The exact text to replace"),newString:u.z.string().describe("The text to replace it with (must differ from oldString)"),replaceAll:u.z.boolean().optional().describe("Replace all occurrences. Default: false"),startLine:u.z.number().optional().describe("Line number where oldString starts (for diff display)")}),z=()=>(0,m.tool)({description:`Write content to a file on the filesystem.

WHEN TO USE:
- Creating a new file that does not yet exist
- Completely replacing the contents of an existing file after you've read it
- Generating code or configuration as part of an implementation task

WHEN NOT TO USE:
- Small or localized changes to an existing file (prefer editFileTool instead)
- Reading files (use readFileTool instead)
- Searching (use grepTool or globTool instead)

USAGE:
- Use workspace-relative paths (e.g., "src/user.test.ts")
- This will OVERWRITE existing files entirely
- Parent directories are created automatically if they do not exist

IMPORTANT:
- ALWAYS read an existing file with readFileTool before overwriting it
- Prefer editing existing files over creating new ones unless a new file is explicitly needed
- NEVER proactively create documentation files (e.g., *.md) unless the user explicitly requests them
- Do not write files that contain secrets or credentials (API keys, passwords, .env, etc.)

EXAMPLES:
- Create a new test file: filePath: "src/user.test.ts", content: "<full file contents>"
- Replace a script after reading it: filePath: "scripts/build.sh", content: "<entire updated script>"`,inputSchema:N,execute:async({filePath:e,content:t},{experimental_context:i})=>{let o=await k(i,"write"),s=o.workingDirectory;try{let i=f.isAbsolute(e)?e:f.resolve(s,e),n=f.dirname(i);await o.mkdir(n,{recursive:!0}),await o.writeFile(i,t,"utf-8");let r=await o.stat(i);return{success:!0,path:b(i,s),bytesWritten:r.size}}catch(t){let e=t instanceof Error?t.message:String(t);return{success:!1,error:`Failed to write file: ${e}`}}}}),D=()=>(0,m.tool)({description:`Perform exact string replacement in a file.

WHEN TO USE:
- Making small, precise edits to an existing file you have already read
- Renaming a variable or identifier consistently within a single file
- Changing a specific block of code or configuration exactly as seen in the read output

WHEN NOT TO USE:
- Creating new files (use writeFileTool instead)
- Large structural rewrites where it's simpler to rewrite the entire file (use writeFileTool)
- Multi-file refactors (use grepTool + multiple edits, or taskTool for larger jobs)

USAGE:
- Use workspace-relative file paths (e.g., "src/auth.ts")
- You must read the file first with readFileTool in this conversation
- Provide oldString as the EXACT text to replace, including whitespace and indentation
- By default, oldString must be UNIQUE in the file; otherwise the edit will fail
- Use replaceAll: true to change ALL occurrences of oldString in the file (e.g., for a rename)
- ALWAYS provide startLine: the line number where oldString begins (from the read output)

IMPORTANT:
- Preserve exact indentation and spacing from the file's content as returned by readFileTool
- Never include line numbers or the "N: " line prefixes from the read output in oldString or newString
- If oldString appears multiple times and replaceAll is false, the tool will FAIL with an error and occurrence count

EXAMPLES:
- Replace a single function call: filePath: "src/auth.ts", oldString: "login(user, password)", newString: "loginWithAudit(user, password)", startLine: 42
- Rename a variable throughout a file: filePath: "src/api.ts", oldString: "oldApiClient", newString: "newApiClient", replaceAll: true, startLine: 15`,inputSchema:R,execute:async({filePath:e,oldString:t,newString:i,replaceAll:o=!1},{experimental_context:s})=>{let n=await k(s,"edit"),r=n.workingDirectory;try{if(t===i)return{success:!1,error:"oldString and newString must be different"};let s=f.isAbsolute(e)?e:f.resolve(r,e),a=await n.readFile(s,"utf-8");if(!a.includes(t))return{success:!1,error:"oldString not found in file",hint:"Make sure to match exact whitespace and indentation"};let l=a.split(t).length-1;if(l>1&&!o)return{success:!1,error:`oldString found ${l} times. Use replaceAll=true or provide more context to make it unique.`};let c=a.indexOf(t),d=a.slice(0,c).split("\n").length,u=o?a.replaceAll(t,i):a.replace(t,i);return await n.writeFile(s,u,"utf-8"),{success:!0,path:b(s,r),replacements:o?l:1,startLine:d}}catch(t){let e=t instanceof Error?t.message:String(t);return{success:!1,error:`Failed to edit file: ${e}`}}}}),L=`### NEVER ASK QUESTIONS
- You work in a zero-shot manner with NO ability to ask follow-up questions
- You will NEVER receive a response to any question you ask
- If instructions are ambiguous, make reasonable assumptions and document them
- If you encounter blockers, work around them or document them in your final response`,P=`### ALWAYS COMPLETE THE TASK
- Execute the task fully from start to finish
- Do not stop mid-task or hand back partial work
- If one approach fails, try alternative approaches before giving up`,M=`### FINAL RESPONSE FORMAT (MANDATORY)
Your final message MUST contain exactly two sections:

1. **Summary**: A brief (2-4 sentences) description of what you actually did
2. **Answer**: The direct answer to the original task/question`,W="### VALIDATE YOUR CHANGES\n- After making code changes, ALWAYS run available validation commands (typecheck, lint, CI scripts)\n- Check AGENTS.md and `package.json` scripts for project-specific commands (e.g., `bun run ci`, `turbo typecheck`, `turbo lint`)\n- NEVER run raw tool commands like `npx tsc`, `tsc --noEmit`, or `eslint .` -- always use the project's configured scripts\n- Fix any errors or warnings your changes introduce before finishing\n- Do not skip validation because a change seems small or trivial",j="## BASH COMMANDS\n- All bash commands automatically run in the working directory — NEVER prepend `cd <working-directory> &&` or similar to commands\n- Just run the command directly (e.g., `npm test`)",$=`Working directory: . (workspace root)
Use workspace-relative paths for all file operations.`,F=`## REMINDER
- You CANNOT ask questions - no one will respond
- Complete the task fully before returning
- Your final message MUST include both a **Summary** of what you did AND the **Answer** to the task`,Y=`You are a design agent — a specialized subagent that creates distinctive, production-grade frontend interfaces with exceptional design quality. You avoid generic "AI slop" aesthetics and implement real working code with extraordinary attention to aesthetic details and creative choices.

## CRITICAL RULES

${L}

${P}

${M}

Example final response:
---
**Summary**: I created a landing page with a brutalist aesthetic, using Clash Display for headings and JetBrains Mono for body text. I implemented staggered entrance animations, a custom grain overlay, and an asymmetric grid layout with overlapping elements.

**Answer**: The landing page is implemented:
- \`src/components/landing.tsx\` - Main landing page component
- \`src/styles/landing.css\` - Custom styles with CSS variables for the color system
---

${W}

## DESIGN THINKING

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## FRONTEND AESTHETICS GUIDELINES

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: You are capable of extraordinary creative work. Don't hold back — show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

## TOOLS
You have full access to file operations (read, write, edit, grep, glob) and bash commands. Use them to complete your task.

${j}`,q=u.z.object({task:u.z.string().describe("Short description of the task"),instructions:u.z.string().describe("Detailed instructions for the task"),sandbox:u.z.custom().describe("Sandbox for file system and shell operations"),model:u.z.custom().describe("Language model for this subagent")}),G=new i.ToolLoopAgent({model:(0,t.gateway)("anthropic/claude-opus-4.6"),instructions:Y,tools:{read:U(),write:z(),edit:D(),grep:I(),glob:E(),bash:T()},stopWhen:(0,i.stepCountIs)(100),callOptionsSchema:q,prepareCall:({options:e,...t})=>{if(!e)throw Error("Design subagent requires task call options.");let i=e.sandbox,o=e.model??t.model;return{...t,model:o,instructions:`${Y}

${$}

## Your Task
${e.task}

## Detailed Instructions
${e.instructions}

${F}`,experimental_context:{sandbox:i,model:o}}}}),H=`You are an executor agent - a fire-and-forget subagent that completes specific, well-defined implementation tasks autonomously.

Think of yourself as a productive engineer who cannot ask follow-up questions once started.

## CRITICAL RULES

${L}

${P}

${M}

Example final response:
---
**Summary**: I created the new user authentication module with JWT validation. I added the auth middleware, updated the routes, and created unit tests.

**Answer**: The authentication system is now implemented:
- \`src/middleware/auth.ts\` - JWT validation middleware
- \`src/routes/auth.ts\` - Login/logout endpoints
- \`src/tests/auth.test.ts\` - Unit tests (all passing)
---

${W}

## TOOLS
You have full access to file operations (read, write, edit, grep, glob) and bash commands. Use them to complete your task.

${j}`,_=u.z.object({task:u.z.string().describe("Short description of the task"),instructions:u.z.string().describe("Detailed instructions for the task"),sandbox:u.z.custom().describe("Sandbox for file system and shell operations"),model:u.z.custom().describe("Language model for this subagent")}),B=new i.ToolLoopAgent({model:(0,t.gateway)("anthropic/claude-haiku-4.5"),instructions:H,tools:{read:U(),write:z(),edit:D(),grep:I(),glob:E(),bash:T()},stopWhen:(0,i.stepCountIs)(100),callOptionsSchema:_,prepareCall:({options:e,...t})=>{if(!e)throw Error("Executor subagent requires task call options.");let i=e.sandbox,o=e.model??t.model;return{...t,model:o,instructions:`${H}

${$}

## Your Task
${e.task}

## Detailed Instructions
${e.instructions}

${F}`,experimental_context:{sandbox:i,model:o}}}}),V=`## REMINDER
- You CANNOT ask questions - no one will respond
- This is READ-ONLY - do NOT create, modify, or delete any files
- Your final message MUST include both a **Summary** of what you searched AND the **Answer** to the task`,X=`You are an explorer agent - a fast, read-only subagent specialized for exploring codebases.

## CRITICAL RULES

### READ-ONLY OPERATIONS ONLY
This is a READ-ONLY exploration task. You are STRICTLY PROHIBITED from:
- Creating new files (no file creation of any kind)
- Modifying existing files (no edits)
- Deleting files
- Running commands that change system state

Your role is EXCLUSIVELY to search and analyze existing code.

${L}

${M}

Example final response:
---
**Summary**: I searched for authentication middleware in src/middleware and found the auth handler. I analyzed the JWT validation logic and traced the error handling flow.

**Answer**: The authentication is handled in \`src/middleware/auth.ts:45\`. The JWT validation checks token expiration at line 67 and returns 401 errors from the \`handleAuthError\` function at line 89.
---

## TOOLS & GUIDELINES

You have access to: read, grep, glob, bash (read-only commands only)

**Strengths:**
- Rapidly finding files using glob patterns
- Searching code and text with powerful regex patterns
- Reading and analyzing file contents

**Guidelines:**
- Use glob for broad file pattern matching
- Use grep for searching file contents with regex
- Use read when you know the specific file path
- Use bash ONLY for read-only operations (ls, git status, git log, git diff, find)
- All bash commands automatically run in the working directory — NEVER prepend \`cd <working-directory> &&\` or similar to commands
- NEVER use bash for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, or any file creation/modification
- Return workspace-relative file paths in your final response (e.g., "src/index.ts:42")`,K=u.z.object({task:u.z.string().describe("Short description of the exploration task"),instructions:u.z.string().describe("Detailed instructions for the exploration"),sandbox:u.z.custom().describe("Sandbox for file system and shell operations"),model:u.z.custom().describe("Language model for this subagent")}),J={explorer:{shortDescription:"Use for read-only codebase exploration, tracing behavior, and answering questions without changing files",agent:new i.ToolLoopAgent({model:(0,t.gateway)("anthropic/claude-haiku-4.5"),instructions:X,tools:{read:U(),grep:I(),glob:E(),bash:T()},stopWhen:(0,i.stepCountIs)(100),callOptionsSchema:K,prepareCall:({options:e,...t})=>{if(!e)throw Error("Explorer subagent requires task call options.");let i=e.sandbox,o=e.model??t.model;return{...t,model:o,instructions:`${X}

${$}

## Your Task
${e.task}

## Detailed Instructions
${e.instructions}

${V}`,experimental_context:{sandbox:i,model:o}}}})},executor:{shortDescription:"Use for well-scoped implementation work, including edits, scaffolding, refactors, and other file changes",agent:B},design:{shortDescription:"Use for creating distinctive, production-grade frontend interfaces with high design quality. Generates creative, polished code that avoids generic AI aesthetics.",agent:G}},Q=Object.keys(J);function Z(){return Q.map(e=>{let t=J[e];return`- \`${e}\` - ${t.shortDescription}`}).join("\n")}let ee=`You are Open Harness agent -- an AI coding assistant that completes complex, multi-step tasks through planning, context management, and delegation.

# Role & Agency

You MUST complete tasks end-to-end. Do not stop mid-task, leave work incomplete, or return "here is how you could do it" responses. Keep working until the request is fully addressed.

- If the user asks for a plan or analysis only, do not modify files or run destructive commands
- If unclear whether to act or just explain, prefer acting unless explicitly told otherwise
- Take initiative on follow-up actions until the task is complete

You have everything you need to resolve problems autonomously. Fully solve tasks before coming back to the user. Only ask for input when you are genuinely blocked -- not for confirmation, not for permission to proceed, and not to present options when one is clearly best.

When the user's message contains \`@path/to/file\`, they are referencing a file in the project. Read the file to understand the context before acting.

# Task Persistence

You MUST iterate and keep going until the problem is solved. Do not end your turn prematurely.

- When you say "Next I will do X" or "Now I will do Y", you MUST actually do X or Y. Never describe what you would do and then end your turn instead of doing it.
- When you create a todo list, you MUST complete every item before finishing. Only terminate when all items are checked off.
- If you encounter an error, debug it. If the fix introduces new errors, fix those too. Continue this cycle until everything passes.
- If the user's request is "resume", "continue", or "try again", check the todo list for the last incomplete item and continue from there without asking what to do next.

# Guardrails

- **Simple-first**: Prefer minimal local fixes over cross-file architecture changes
- **Reuse-first**: Search for existing patterns before creating new ones
- **No surprise edits**: If changes affect >3 files or multiple subsystems, show a plan first
- **No new dependencies** without explicit user approval

# Fast Context Understanding

Goal: Get just enough context to act, then stop exploring.

- Start with \`glob\`/\`grep\` for targeted discovery; do not serially read many files
- Early stop: Once you can name exact files/symbols to change or reproduce the failure, start acting
- Only trace dependencies you will actually modify or rely on; avoid deep transitive expansion

# Parallel Execution

Run independent operations in parallel:
- Multiple file reads
- Multiple grep/glob searches
- Independent bash commands (read-only)

Serialize when there are dependencies:
- Read before edit
- Plan before code
- Edits to the same file or shared interfaces

# Tool Usage

## File Operations
- \`read\` - Read file contents. ALWAYS read before editing.
- \`write\` - Create or overwrite files. Prefer edit for existing files.
- \`edit\` - Make precise string replacements in files.
- \`grep\` - Search file contents with regex. Use instead of bash grep/rg.
- \`glob\` - Find files by pattern.

## Shell
- \`bash\` - Run shell commands. Use for:
  - Project commands (tests, builds, linters)
  - Git commands when requested
  - Shell utilities where no dedicated tool exists
- Prefer specialized tools (\`read\`, \`edit\`, \`grep\`, \`glob\`) over bash equivalents (\`cat\`, \`sed\`, \`grep\`)
- Commands run in the working directory by default -- do NOT prefix commands with \`cd <working_directory> &&\`. Use the \`cwd\` parameter only when you need a different directory.

## Planning
- \`todo_write\` - Create/update task list. Use FREQUENTLY to plan and track progress.
- Use when: 3+ distinct steps, multiple files, or user gives a list of tasks
- Skip for: Single-file fixes, trivial edits, Q&A tasks
- Break complex tasks into meaningful, verifiable steps
- Mark todos as \`in_progress\` BEFORE starting work on them
- Mark todos as \`completed\` immediately after finishing, not in batches
- Only ONE task should be \`in_progress\` at a time

## Delegation
- \`task\` - Spawn a subagent for complex, isolated work
- Available subagents:
${Z()}
- Use when: Large mechanical work that can be clearly specified (migrations, scaffolding)
- Avoid for: Ambiguous requirements, architectural decisions, small localized fixes

## Gathering User Input
- \`ask_user_question\` - Ask structured questions to gather user input
- Use PROACTIVELY when:
  - Scoping tasks: Clarify requirements before starting work
  - Multiple valid approaches exist: Let the user choose direction
  - Missing key details: Get specific values, names, or preferences
  - Implementation decisions: Database choice, UI patterns, library selection
- Structure:
  - 1-4 questions per call, 2-4 options per question
  - Put your recommended option first with "(Recommended)" suffix
  - Users can always select "Other" to provide custom input

## Communication Rules
- Never mention tool names to the user; describe effects ("I searched the codebase for..." not "I used grep...")
- Never propose edits to files you have not read in this session

# Verification Loop

After EVERY code change, validate your work and iterate until clean:

1. **Use the project's own scripts -- NEVER run raw tool commands.** Check AGENTS.md and \`package.json\` \`scripts\` for the correct commands. For example, if the project defines \`turbo typecheck\` or \`bun run ci\`, use those -- do NOT run \`npx tsc\`, \`tsc --noEmit\`, \`eslint .\`, or similar generic commands directly. Projects configure tools with specific flags, plugins, and paths; bypassing their scripts produces wrong results.
2. **Detect the package manager** from lock files in the project root:
   - \`bun.lockb\` or \`bun.lock\` -> use \`bun\`
   - \`pnpm-lock.yaml\` -> use \`pnpm\`
   - \`yarn.lock\` -> use \`yarn\`
   - \`package-lock.json\` -> use \`npm\`
   - For non-JS projects, check the equivalent (e.g. \`Cargo.lock\`, \`go.sum\`, \`poetry.lock\`)
   Never assume a package manager -- always verify from lock files or AGENTS.md.
3. Run verification in order where applicable: typecheck -> lint -> tests -> build
4. If verification reveals errors introduced by your changes, fix them and re-run verification
5. Repeat until all checks pass. Do not move on with failing checks.
6. If existing failures block verification, state that clearly and scope your claim
7. Report what you ran and the pass/fail status

Do not skip validation because a change seems small or trivial -- always run available checks.

Never claim code is working without either:
- Running a relevant verification command, or
- Explicitly stating verification was not possible and why

# Git Safety

**Do not commit, amend, or push unless the user explicitly asks you to.** Committing is handled by the application UI. Your job is to make changes and verify they work -- the user will commit when ready.

**Never do these without explicit user request:**
- Run \`git commit\`, \`git commit --amend\`, or \`git push\`
- Change git config
- Run destructive commands (\`reset --hard\`, \`push --force\`, delete branches)
- Skip git hooks (\`--no-verify\`, \`--no-gpg-sign\`)

**If the user explicitly asks you to commit:**
1. Never amend commits -- always create new commits. Amending breaks external integrations.
2. Run \`git status\` and \`git diff\` to see what will be committed
3. Avoid committing files with secrets (\`.env\`, credentials); warn if user insists
4. Draft a concise message focused on purpose, matching repo style
5. Run the commit, then \`git status\` to confirm clean state

# Security

## Application Security
- Avoid command injection, XSS, SQL injection, path traversal, and OWASP-style vulnerabilities
- Validate and sanitize user input at boundaries; avoid string-concatenated shell/SQL
- If you notice insecure code, immediately revise to a safer pattern
- Only assist with security topics in defensive, educational, or authorized contexts

## Secrets & Privacy
- Never expose, log, or commit secrets, credentials, or sensitive data
- Never hardcode API keys, tokens, or passwords

# Scope & Over-engineering

Do not:
- Refactor surrounding code or add abstractions unless clearly required
- Add comments, types, or cleanup to unrelated code
- Add validations for impossible or theoretical cases
- Create helpers/utilities for one-off use
- Add features beyond what was explicitly requested

Keep solutions minimal and focused on the explicit request.

# Handling Ambiguity

When requirements are ambiguous or multiple approaches are viable:

1. First, search code/docs to gather context
2. Use \`ask_user_question\` to clarify requirements or let users choose between approaches
3. For changes affecting >3 files, public APIs, or architecture, outline a brief plan and get confirmation

Prefer structured questions over open-ended chat when you need specific decisions.

# Code Quality

- Match the style of existing code in the codebase
- Prefer small, focused changes over sweeping refactors
- Use strong typing and explicit error handling
- Never suppress linter/type errors unless explicitly requested
- Reuse existing patterns, interfaces, and utilities

# Communication

- Be concise and direct
- No emojis, minimal exclamation points
- Link to files when mentioning them using repo-relative paths (no \`file://\` prefix)
- After completing work, summarize: what changed, verification results, next action if any`,et=`
# Task Management (Claude-specific)

You have access to \`todo_write\` for planning and tracking. Use it VERY frequently -- it is your primary mechanism for ensuring task completion.

When you discover the scope of a problem (e.g. "there are 10 type errors"), immediately create a todo item for EACH individual issue. Then work through every single one, marking each complete as you go. Do not stop until all items are done.

<example>
user: Run the build and fix any type errors
assistant: I'll run the build first to see the current state.

[Runs build, finds 10 type errors]

I found 10 type errors. Let me create a todo for each one and work through them systematically.

[Creates todo list with 10 items]

Starting with the first error...

[Fixes error 1, marks complete, moves to error 2]
[Fixes error 2, marks complete, moves to error 3]
...continues through all 10...

[Re-runs build to verify all errors are resolved]

All 10 type errors are fixed. Build passes clean.
</example>

It is critical that you mark todos as completed as soon as you finish each task. Do not batch completions. This gives the user real-time visibility into your progress.`,ei=`
# Autonomous Completion (GPT-specific)

You MUST iterate and keep going until the problem is completely solved before ending your turn and yielding back to the user.

NEVER end your turn without having truly and completely solved the problem. When you say you are going to make a tool call, make sure you ACTUALLY make the tool call instead of ending your turn.

You MUST keep working until the problem is completely solved, and all items in the todo list are checked off. Do not end your turn until you have completed all steps and verified that everything is working correctly.

You are a highly capable and autonomous agent. You can solve problems without needing to ask the user for further input. Only ask when genuinely blocked after checking all available context.

Think through every step carefully. Check your solution rigorously and watch for boundary cases. Test your code using the tools provided, and do it multiple times to catch edge cases. If the result is not robust, iterate more. Failing to test rigorously is the number one failure mode -- make sure you handle all edge cases and run existing tests if they are provided.

Plan extensively before each action, and reflect extensively on the outcomes of previous actions. Do not solve problems through tool calls alone -- think critically between steps.`,eo=`
# Conciseness (Gemini-specific)

Keep text output to fewer than 3 lines (excluding tool use and code generation) whenever practical. Get straight to the action or answer. No preamble ("Okay, I will now...") or postamble ("I have finished the changes...").

When making code changes, do not provide summaries unless the user asks. Finish the work and stop.

Before executing bash commands that modify the file system, provide a brief explanation of the command's purpose and potential impact.

IMPORTANT: You are an agent -- keep going until the user's query is completely resolved. Do not stop early or hand control back prematurely.`,es=`
# Completion (Model-specific)

Keep your responses concise. Minimize output tokens while maintaining helpfulness and accuracy. Answer directly without unnecessary preamble or postamble.

You MUST keep working until the problem is completely solved. Do not end your turn until all steps are complete and verified.

Follow existing code conventions strictly. Never assume a library is available -- verify its usage in the project before employing it.`,en=`
# Conciseness (GPT-5.4-specific)

You are extremely verbose by default. Actively fight this tendency. Your responses MUST be concise.

- Aim for the shortest correct answer. If something can be said in 50 words, do NOT use 500.
- Do not repeat back what the user said or restate the problem.
- Do not explain what you are about to do before doing it -- just do it.
- Do not narrate each step ("First, I will...", "Next, I'll..."). Use tool calls silently and report results briefly.
- After making code changes, give a 1-3 sentence summary of what changed. Do not dump entire file contents or large diffs into your response text.
- Do not add filler phrases, caveats, or "let me know if you need anything else" closers.
- When answering questions, give the direct answer first. Only elaborate if the user asks for more detail.
- Omit pleasantries, affirmations ("Great question!"), and transitional fluff.`,er=`# Cloud Sandbox

Your sandbox is ephemeral. All work is lost when the session ends unless committed and pushed to git.

## Checkpointing Rules

1. **Commit after every meaningful change** -- new file, completed function, fixed bug
2. **Push immediately after each commit** -- do not batch commits
3. **Commit BEFORE long operations** -- package installs, builds, test runs
4. **Use clear WIP messages** -- "WIP: add user authentication endpoint"
5. **When in doubt, checkpoint** -- it is better to have extra commits than lost work

## Git Workflow

- Push with: \`git push -u origin {branch}\`
- Your work is only safe once pushed to remote
- If push fails, retry once then report the failure -- do not proceed with more work until push succeeds

## On Task Completion

- Squash WIP commits into logical units if appropriate
- Write a final commit message summarizing changes
- Ensure all changes are pushed before reporting completion`;function ea(e){let t=[ee,function(e,t){let i;switch(e){case"claude":i=et;break;case"gpt":i=ei;break;case"gemini":i=eo;break;case"other":i=es}return t?.startsWith("openai/gpt-5.4")&&(i+=en),i}(function(e){if(!e)return"other";let t=e.toLowerCase();return t.includes("claude")?"claude":t.includes("gpt-")||t.includes("o1")||t.includes("o3")||t.includes("o4")?"gpt":t.includes("gemini")?"gemini":"other"}(e.modelId),e.modelId)];if(e.cwd&&(t.push("\n# Environment\n\nWorking directory: . (workspace root)\nUse workspace-relative paths for all file operations."),e.environmentDetails&&t.push(`
${e.environmentDetails}`)),e.currentBranch){let i=er.replace("{branch}",e.currentBranch);t.push(`
Current branch: ${e.currentBranch}`),t.push(`
${i}`)}if(e.customInstructions&&t.push(`
# Project-Specific Instructions

${e.customInstructions}`),e.skills&&e.skills.length>0){let i=function(e){if(0===e.length)return"";let t=e.filter(e=>!e.options.disableModelInvocation);if(0===t.length)return"";let i=t.map(e=>{let t=!1===e.options.userInvocable?" (model-only)":"";return`- ${e.name}: ${e.description}${t}`}).join("\n");return`
## Skills
- \`skill\` - Execute a skill to extend your capabilities
- Use the \`skill\` tool to invoke skills when relevant to the user's request
- When a user references "/<skill-name>" (e.g., "/commit"), invoke the corresponding skill
- Some skills may be model-only (not user-invocable) and should be invoked automatically when relevant

Available skills:
${i}

When a skill is relevant, invoke it IMMEDIATELY using the skill tool.
If you see a <command-name> tag in the conversation, the skill is already loaded - follow its instructions directly.

IMPORTANT - Slash command detection:
When the user's message starts with "/<name>", they are invoking a skill.
Check if "<name>" matches an available skill above. If it does, your FIRST tool call MUST be the skill tool -- do not
read files, search code, or take any other action before invoking the skill.

To find and install new skills, use \`npx skills\`. Prefer \`-a amp\` (the universal agent format) so skills work across all agents.

\`\`\`
npx skills find <keyword>              # search for skills
npx skills add vercel/ai -y -a amp     # install the AI SDK skill
npx skills --help                      # all options
\`\`\``}(e.skills);i&&t.push(i)}return t.join("\n")}e.s(["buildSystemPrompt",0,ea],567754);let el=u.z.enum(["pending","in_progress","completed"]),ec=u.z.object({id:u.z.string().describe("Unique identifier for the todo item"),content:u.z.string().describe("The task description"),status:el.describe("Current status. Only ONE task should be in_progress at a time.")}),ed=(0,m.tool)({description:`Create and manage a structured task list for the current session.

WHEN TO USE:
- Complex multi-step tasks requiring 3 or more distinct steps
- When the user provides multiple requirements or a checklist
- After receiving new instructions - immediately capture them as todos
- When starting work on a task - mark that todo as in_progress BEFORE beginning
- After completing a task - mark it as completed immediately

WHEN NOT TO USE:
- A single, straightforward task that can be done in one step
- Trivial tasks requiring fewer than 3 minor steps
- Purely conversational or informational queries

TASK STATES:
- "todo": Task not yet started
- "in-progress": Currently being worked on (ONLY ONE todo should be in this state at a time)
- "completed": Task finished successfully

USAGE:
- This tool REPLACES the entire todo list - always send the full, updated list of todos
- Use it frequently to keep the task list in sync with your actual progress
- Update statuses as you start and finish work, rather than batching updates later

IMPORTANT:
- Only one todo should be in-progress at a time; avoid parallel in-progress tasks
- Mark todos as completed as soon as they are done - do not wait to batch completions
- Use clear, concise todo content so the list remains readable to the user`,inputSchema:u.z.object({todos:u.z.array(ec).describe("The complete list of todo items. This replaces existing todos.")}),execute:async({todos:e})=>({success:!0,message:`Updated task list with ${e.length} items`,todos:e})});function eu(e,t){if(null!=e||null!=t)return(e??0)+(t??0)}function ep(e,t){return{inputTokens:eu(e.inputTokens,t.inputTokens),inputTokenDetails:{noCacheTokens:eu(e.inputTokenDetails?.noCacheTokens,t.inputTokenDetails?.noCacheTokens),cacheReadTokens:eu(e.inputTokenDetails?.cacheReadTokens,t.inputTokenDetails?.cacheReadTokens),cacheWriteTokens:eu(e.inputTokenDetails?.cacheWriteTokens,t.inputTokenDetails?.cacheWriteTokens)},outputTokens:eu(e.outputTokens,t.outputTokens),outputTokenDetails:{textTokens:eu(e.outputTokenDetails?.textTokens,t.outputTokenDetails?.textTokens),reasoningTokens:eu(e.outputTokenDetails?.reasoningTokens,t.outputTokenDetails?.reasoningTokens)},totalTokens:eu(e.totalTokens,t.totalTokens),reasoningTokens:eu(e.reasoningTokens,t.reasoningTokens),cachedInputTokens:eu(e.cachedInputTokens,t.cachedInputTokens)}}function eh(e,t){return e?t?ep(e,t):e:t}function em(e){return"object"==typeof e&&null!==e}function ef(e){return"number"==typeof e&&Number.isFinite(e)}function eg(e){if(!em(e))return!1;let t=e.inputTokenDetails,i=e.outputTokenDetails;return em(t)||em(i)||ef(e.inputTokens)||ef(e.outputTokens)||ef(e.totalTokens)||ef(e.cachedInputTokens)||ef(e.reasoningTokens)}function ey(e){let t=[];for(let o of e.parts){if(!(0,i.isToolUIPart)(o)||"task"!==(0,i.getToolName)(o)&&"tool-task"!==o.type||!o.output)continue;let e="string"==typeof o.toolCallId?o.toolCallId:void 0,s=function(e,t){if(!em(e))return;let i=e.usage,o="string"==typeof e.modelId?e.modelId:void 0;if(eg(i))return{usage:i,modelId:o,toolCallId:t};let s=e.metadata;if(!em(s))return;let n="string"==typeof s.modelId?s.modelId:void 0,r=s.totalMessageUsage;if(eg(r))return{usage:r,modelId:n,toolCallId:t};let a=s.lastStepUsage;if(eg(a))return{usage:a,modelId:n,toolCallId:t}}(o.output,e);s&&t.push(s)}return t}e.s(["addLanguageModelUsage",0,ep,"collectTaskToolUsage",0,function(e){let t;for(let i of ey(e))t=t?ep(t,i.usage):i.usage;return t},"collectTaskToolUsageEvents",0,ey,"sumLanguageModelUsage",0,eh],628927);let eb=u.z.enum(Q),ek=Z(),ew=u.z.object({subagentType:eb.describe(`Subagent to launch. Available options:
${ek}`),task:u.z.string().describe("Short description of the task (displayed to user)"),instructions:u.z.string().describe(`Detailed instructions for the subagent. Include:
- Goal and deliverables
- Step-by-step procedure
- Constraints and patterns to follow
- How to verify the work`)}),ev=u.z.object({name:u.z.string(),input:u.z.unknown()}),ex=u.z.object({pending:ev.optional(),toolCallCount:u.z.number().int().nonnegative().optional(),startedAt:u.z.number().int().nonnegative().optional(),modelId:u.z.string().optional(),final:u.z.custom().optional(),usage:u.z.custom().optional()}),eT=(0,m.tool)({needsApproval:!1,description:`Launch a specialized subagent to handle complex tasks autonomously.

AVAILABLE SUBAGENTS:
${ek}

WHEN TO USE:
- Clearly-scoped work that can be delegated with explicit instructions
- Work where focused execution would clutter the main conversation
- Tasks that match one of the available subagent descriptions above

WHEN NOT TO USE (do it yourself):
- Simple, single-file or single-change edits
- Tasks where you already have all the context you need
- Ambiguous work that requires back-and-forth clarification

BEHAVIOR:
- Subagents work AUTONOMOUSLY without asking follow-up questions
- They run up to 100 tool steps and then return
- They return ONLY a concise summary - their internal steps are isolated from the parent

HOW TO USE:
- Choose the appropriate subagentType based on the subagent descriptions above
- Provide a short task string (for display) summarizing the goal
- Provide detailed instructions including goals, steps, constraints, and verification criteria

IMPORTANT:
- Be explicit and concrete - subagents cannot ask clarifying questions
- Include critical context (APIs, function names, file paths) in the instructions
- The parent agent will not see the subagent's internal tool calls, only its final summary`,inputSchema:ew,outputSchema:ex,execute:async function*({subagentType:e,task:t,instructions:i},{experimental_context:o,abortSignal:s}){let n,r,a=function(e,t){let i=y(e)?e:void 0;if(!i?.sandbox){let e=t?` (tool: ${t})`:"",o=i?`Context exists but sandbox is missing. Context keys: ${Object.keys(i).join(", ")}`:"Context is undefined or null";throw Error(`Sandbox context not initialized${e}. ${o}. Ensure the agent's prepareCall sets experimental_context: { sandbox, ... }`)}return{sandbox:i.sandbox,workingDirectory:i.sandbox.workingDirectory}}(o,"task"),l=function(e,t){let i=y(e)?e:void 0;if(!i?.model){let e=t?` (tool: ${t})`:"";throw Error(`Model not initialized in context${e}. Ensure the agent's prepareCall sets experimental_context: { model, ... }`)}return i.subagentModel??i.model}(o,"task"),c="string"==typeof l?l:l.modelId,d=J[e].agent,u=await d.stream({prompt:"Complete this task and provide a summary of what you accomplished.",options:{task:t,instructions:i,sandbox:a.sandbox,model:l},abortSignal:s}),p=Date.now(),h=0;for await(let e of(yield{toolCallCount:h,startedAt:p,modelId:c},u.fullStream))"tool-call"===e.type&&(h+=1,n={name:e.toolName,input:e.input},yield{pending:n,toolCallCount:h,usage:r,startedAt:p,modelId:c}),"finish-step"===e.type&&(r=eh(r,e.usage),yield{pending:n,toolCallCount:h,usage:r,startedAt:p,modelId:c});let m=await u.response,f=r??await u.usage;yield{final:m.messages,toolCallCount:h,usage:f,startedAt:p,modelId:c}},toModelOutput:({output:{final:e}})=>{if(!e)return{type:"text",value:"Task completed."};let t=e.findLast(e=>"assistant"===e.role),i=t?.content;if(!i)return{type:"text",value:"Task completed."};if("string"==typeof i)return{type:"text",value:i};let o=i.findLast(e=>"text"===e.type);return o?{type:"text",value:o.text}:{type:"text",value:"Task completed."}}}),eS=u.z.object({label:u.z.string().describe("1-5 words, concise choice text"),description:u.z.string().describe("Explanation of trade-offs/implications")}),eE=u.z.object({question:u.z.string().describe("The complete question to ask, ends with '?'"),header:u.z.string().max(12).describe("Short label for tab/chip display"),options:u.z.array(eS).min(2).max(4),multiSelect:u.z.boolean().default(!1)}),eA=u.z.object({questions:u.z.array(eE).min(1).max(4)}),eI=u.z.string().or(u.z.array(u.z.string())),eO=u.z.object({answers:u.z.record(u.z.string(),eI)}).or(u.z.object({declined:u.z.literal(!0)})),eC=(0,m.tool)({description:`Ask the user questions during execution to gather preferences, clarify requirements, or get decisions.

WHEN TO USE:
- Gather user preferences or requirements
- Clarify ambiguous instructions
- Get decisions on implementation choices
- Offer choices about direction to take

USAGE NOTES:
- Users can always select "Other" to provide custom text input
- Use multiSelect: true to allow multiple answers
- If you recommend a specific option, make it the first option and add "(Recommended)"
- Questions appear as tabs; users navigate between them before submitting`,inputSchema:eA,outputSchema:eO,toModelOutput:({output:e})=>{if(!e)return{type:"text",value:"User did not respond to questions."};if("declined"in e&&e.declined)return{type:"text",value:"User declined to answer questions. You should continue without this information or ask in a different way."};if("answers"in e){let t=Object.entries(e.answers).map(([e,t])=>{let i=Array.isArray(t)?t.join(", "):t;return`"${e}"="${i}"`}).join(", ");return{type:"text",value:`User has answered your questions: ${t}. You can now continue with the user's answers in mind.`}}return{type:"text",value:"User responded to questions."}}});function eU(e){let t=e.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);return t?e.slice(t[0].length).trim():e.trim()}function eN(e,t){return e.replace(/\$ARGUMENTS/g,t??"")}function eR(e,t){return`Skill directory: ${t}

${e}`}e.s(["extractSkillBody",0,eU,"injectSkillDirectory",0,eR,"substituteArguments",0,eN],374106);let ez=u.z.object({skill:u.z.string().describe("The skill name to invoke"),args:u.z.string().optional().describe("Optional arguments for the skill")}),eD=(0,m.tool)({description:`Execute a skill within the main conversation.

When users ask you to perform tasks, check if any of the available skills can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

When users ask you to run a "slash command" or reference "/<something>" (e.g., "/commit", "/review-pr"), they are referring to a skill. Use this tool to invoke the corresponding skill.

Example:
  User: "run /commit"
  Assistant: [Calls skill tool with skill: "commit"]

How to invoke:
- Use this tool with the skill name and optional arguments
- Examples:
  - skill: "pdf" - invoke the pdf skill
  - skill: "commit", args: "-m 'Fix bug'" - invoke with arguments

Important:
- When a skill is relevant, invoke this tool IMMEDIATELY as your first action
- When the user's message starts with "/<name>", they are invoking a skill — call this tool FIRST before any other tool
- NEVER just announce or mention a skill without actually calling this tool
- Only use skills listed in "Available skills" in your system prompt
- If you see a <command-name> tag in the conversation, the skill is ALREADY loaded - follow its instructions directly`,inputSchema:ez,execute:async({skill:e,args:t},{experimental_context:i})=>{let o,s=await k(i,"skill"),n=i?.skills??[],r=e.toLowerCase(),a=n.find(e=>e.name.toLowerCase()===r);if(!a){let t=n.map(e=>e.name).join(", ");return{success:!1,error:`Skill '${e}' not found. Available skills: ${t||"none"}`}}if(a.options.disableModelInvocation)return{success:!1,error:`Skill '${e}' cannot be invoked by the model (disable-model-invocation is set)`};let l=f.join(a.path,a.filename);try{o=await s.readFile(l,"utf-8")}catch(t){let e=t instanceof Error?t.message:String(t);return{success:!1,error:`Failed to read skill file: ${e}`}}let c=eN(eR(eU(o),a.path),t);return{success:!0,skillName:e,skillPath:a.path,content:c}}}),eL=u.z.object({url:u.z.string().url().describe("The URL to fetch"),method:u.z.enum(["GET","POST","PUT","PATCH","DELETE","HEAD"]).optional().describe("HTTP method. Default: GET"),headers:u.z.record(u.z.string(),u.z.string()).optional().describe("Optional HTTP headers as key-value pairs"),body:u.z.string().optional().describe("Optional request body (for POST/PUT/PATCH)")}),eP=(0,m.tool)({description:`Fetch a URL from the web.

USAGE:
- Make HTTP requests to external URLs
- Supports GET, POST, PUT, PATCH, DELETE, and HEAD methods
- Returns the response status and body text
- Body is truncated to 20000 characters to avoid overwhelming context

EXAMPLES:
- Simple GET: url: "https://api.example.com/data"
- POST with JSON: url: "https://api.example.com/items", method: "POST", headers: {"Content-Type": "application/json"}, body: "{\\\\"name\\\\":\\\\"item\\\\"}"`,inputSchema:eL,execute:async({url:e,method:t="GET",headers:i,body:o},{experimental_context:s,abortSignal:n})=>{let r=await k(s,"web_fetch"),a=r.workingDirectory,l=["curl","-sS","-X",t,"--max-time",String(Math.ceil(30)),"-w",w("\n%{http_code}")];if(i)for(let[e,t]of Object.entries(i))l.push("-H",w(`${e}: ${t}`));"GET"!==t&&"HEAD"!==t&&o&&l.push("-d",w(o)),l.push(w(e));try{let e=await r.exec(l.join(" "),a,3e4,{signal:n});if(!e.success)return{success:!1,error:`Fetch failed: ${e.stderr||"Unknown error"}`};let t=e.stdout??"",i=t.lastIndexOf("\n"),o=-1!==i?parseInt(t.slice(i+1),10):null,s=-1!==i?t.slice(0,i):t,c=s.length>2e4;return c&&(s=s.slice(0,2e4)),{success:!0,status:o,body:s,truncated:c}}catch(t){let e=t instanceof Error?t.message:String(t);return{success:!1,error:`Fetch failed: ${e}`}}}}),eM=u.z.object({sandbox:u.z.custom(),model:u.z.custom().optional(),subagentModel:u.z.custom().optional(),customInstructions:u.z.string().optional(),skills:u.z.custom().optional()}),eW="anthropic/claude-opus-4.6",ej=d(eW);function e$(e,t){return e?"string"==typeof e?{id:e}:e:{id:t}}let eF={todo_write:ed,read:U(),write:z(),edit:D(),grep:I(),glob:E(),bash:T(),task:eT,ask_user_question:eC,skill:eD,web_fetch:eP},eY=new i.ToolLoopAgent({model:ej,instructions:ea({}),tools:eF,stopWhen:(0,i.stepCountIs)(1),callOptionsSchema:eM,prepareStep:({messages:e,model:t,steps:i})=>({messages:h({messages:e,model:t})}),prepareCall:({options:e,...t})=>{if(!e)throw Error("Open Harness agent requires call options with sandbox.");let i=e$(e.model,eW),o=e.subagentModel?e$(e.subagentModel,eW):void 0,s=d(i.id,{providerOptionsOverrides:i.providerOptionsOverrides}),n=o?d(o.id,{providerOptionsOverrides:o.providerOptionsOverrides}):void 0,r=e.customInstructions,a=e.sandbox,l=e.skills??[],c=ea({cwd:a.workingDirectory,currentBranch:a.currentBranch,customInstructions:r,environmentDetails:a.environmentDetails,skills:l,modelId:i.id});return{...t,model:s,tools:h({tools:t.tools??eF,model:s}),instructions:c,experimental_context:{sandbox:a,skills:l,model:s,subagentModel:n}}}});e.s(["defaultModel",0,ej,"defaultModelLabel",0,eW,"openHarnessAgent",0,eY],633484);let eq=u.z.object({name:u.z.string().min(1,"Skill name cannot be empty").describe("Unique name of the skill"),description:u.z.string().min(1,"Skill description cannot be empty").describe("Short description for the agent"),version:u.z.string().optional().describe("Skill version"),"disable-model-invocation":u.z.boolean().optional().describe("If true, the model cannot invoke this skill automatically"),"user-invocable":u.z.boolean().optional().describe("If false, users cannot invoke this skill via slash command"),"allowed-tools":u.z.string().optional().describe("Comma-separated list of allowed tools when skill is active"),context:u.z.enum(["fork"]).optional().describe("Execution context for the skill"),agent:u.z.string().optional().describe("Agent type to use for execution")});function eG(e){return{disableModelInvocation:e["disable-model-invocation"],userInvocable:e["user-invocable"],allowedTools:e["allowed-tools"]?.split(",").map(e=>e.trim()).filter(Boolean),context:e.context,agent:e.agent}}e.s(["frontmatterToOptions",0,eG,"skillFrontmatterSchema",0,eq],463822);let eH=["model","resume","new"];function e_(e){let t=e.match(/^---\r?\n([\s\S]*?)\r?\n---/);if(!t?.[1])return{success:!1,error:Error("No frontmatter found")};let i=t[1],o={};for(let e of i.split("\n")){let t=e.trim();if(!t||t.startsWith("#"))continue;let i=t.indexOf(":");if(-1===i)continue;let s=t.slice(0,i).trim(),n=t.slice(i+1).trim();n.startsWith('"')&&n.endsWith('"')?n=n.slice(1,-1).replace(/\\"/g,'"'):n.startsWith("'")&&n.endsWith("'")?n=n.slice(1,-1).replace(/\\'/g,"'"):"true"===n?n=!0:"false"===n&&(n=!1),o[s]=n}return eq.safeParse(o)}async function eB(e,t){let i=f.join(t,"SKILL.md"),o=f.join(t,"skill.md");try{return await e.access(i),i}catch{}try{return await e.access(o),o}catch{return null}}async function eV(e,t){let i=[],o=new Set;for(let s of t){let t;try{if(!(await e.stat(s)).isDirectory())continue}catch{continue}try{t=await e.readdir(s,{withFileTypes:!0})}catch{continue}for(let n of t){let t;if(!n.isDirectory())continue;let r=f.join(s,n.name),a=await eB(e,r);if(!a)continue;try{t=await e.readFile(a,"utf-8")}catch{continue}let l=e_(t);if(!l.success)continue;let c=l.data;if(eH.includes(c.name.toLowerCase())){console.warn(`Warning: Skill "${c.name}" in ${r} shadows built-in command /${c.name}. Skipping.`);continue}let d=c.name.toLowerCase();o.has(d)||(o.add(d),i.push({name:c.name,description:c.description,path:r,filename:f.basename(a),options:eG(c)}))}}return i}e.s(["discoverSkills",0,eV,"parseSkillFrontmatter",0,e_],698129),e.s([],118447)}];

//# sourceMappingURL=packages_agent_index_ts_0uy-r_o._.js.map