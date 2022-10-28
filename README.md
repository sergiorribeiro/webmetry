# webmetry
## What?
Webmetry is a set of tools to assist you during web development, specifically, interface design.  
You'll be able to quickly understand alignments and distances on your own projects's interfaces.
## Why?
While working for a web-agency, i've learned that pixel-perfect finishes are as important as keeping the designers busy and happy.  
Webmetry allows the developer to check his work against, grids and axles, while the designers themselves can validate distances and positions, directly on the project interface.
## How?
Webmetry injects code and elements directly on your project, creating a fixed overlay over your rendered pages, where you can setup grids, axles and measurement tapes.  
  
The overlay and tools are controlled via keyboard shortcuts:

| Shortcut  | Effect           |
| ------- | ---------------- |
| **CTRL + SHIFT + O** | Toggles overlay visibility |
| **CTRL + SHIFT + G** | Toggles column grid |
| **CTRL + SHIFT + A** | Adds a set of axles, vertical and horizontal |
| **CTRL + SHIFT + T** | Adds a measurement tape |
| **CTRL + SHIFT + R** | Removes the last interacted tool |

### Enable webmetry on your project
It's easy.  
Just add the following script tag to your page:  
```html
<script 
  src="https://cdn.jsdelivr.net/gh/sergiorribeiro/webmetry/output.js" 
  data-grid-config="until:800;columns:8;margin:2px;gutter:2px;gutterColor:rgba(0,0,0,.6);columnColor:rgba(0,0,0,.4)|until:1000;columns:10;margin:2px;gutter:4px;gutterColor:rgba(0,0,0,.6);columnColor:rgba(0,0,0,.4)|until:9999;columns:12;margin:2px;gutter:8px;gutterColor:rgba(0,0,0,.6);columnColor:rgba(0,0,0,.4)"
  data-axle-config="axleColor:rgba(0,0,0,.5);gripColor:rgba(190,0,0,1)"
  data-measurement-tape-config="tapeColor:rgba(0,0,0,.5);gripColor:rgba(180,0,0,.5);fixedGuideColor:rgba(100,0,0,.8);orientedGuideColor:rgba(0,0,100,.8)"
></script>
```

### Possible values for `data-grid-config`
- **until**, like **800**, instructs webmetry to use this configuration until the specified width
- **columns**, like **12**, set the number of columns
- **margin**, like **2px**, set the CSS margin for the whole grid
- **gutter**, like **2px**, set the CSS width for the gutters
- **gutterColor**, like **rgba(0,0,0,1)**
- **columnColor**, like **rgba(0,0,0,1)**

This configuration block should be repeated for every grid break. Separation is handled with a pipe `|`

Example:
```
data-grid-config="until:800;columns:8;margin:2px;gutter:2px;gutterColor:rgba(0,0,0,.6);columnColor:rgba(0,0,0,.4)|until:1000;columns:10;margin:2px;gutter:4px;gutterColor:rgba(0,0,0,.6);columnColor:rgba(0,0,0,.4)|until:9999;columns:12;margin:2px;gutter:8px;gutterColor:rgba(0,0,0,.6);columnColor:rgba(0,0,0,.4)"
```

### Possible values for `data-axle-config`
- **axleColor**, like **rgba(0,0,0,1)**
- **gripColor**, like **rgba(0,0,0,1)**

Example:
```
data-grid-config="axleColor:rgba(0,0,0,.5);gripColor:rgba(190,0,0,1)"
```

### Possible values for `data-measurement-tape-config`
- **tapeColor**, like **rgba(0,0,0,1)**
- **gripColor**, like **rgba(0,0,0,1)**
- **fixedGuideColor**, like **rgba(0,0,0,1)**
- **orientedGuideColor**, like **rgba(0,0,0,1)**

Example:
```
data-measurement-tape-config="tapeColor:rgba(0,0,0,.5);gripColor:rgba(180,0,0,.5);fixedGuideColor:rgba(100,0,0,.8);orientedGuideColor:rgba(0,0,100,.8)"
```

Value pairs should be separated by a semicolon `;`, and keys separeted from values with a colon `:`

## What's new?
- The code was completely refactored