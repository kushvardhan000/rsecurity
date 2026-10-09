const fs = require('fs');
let text = fs.readFileSync('D:/rsecurity/src/components/Clients.tsx', 'utf-8');

const marqueeHTML = `
        <div className="flex-1 w-[120%] -ml-[10%] flex flex-col justify-center gap-1 md:gap-3 py-6">
          {/* Row 1 */}
          <div className="flex-1 min-h-0 relative">
            <DragMarquee speed={32} gap={4} className="h-full items-stretch">
              {ROW_1.map((c) => <ClientTile key={c.slug} client={c} reduce={reduce} />)}
            </DragMarquee>
          </div>
          {/* Row 2 */}
          <div className="flex-1 min-h-0 relative">
            <DragMarquee speed={26} direction="right" gap={4} className="h-full items-stretch pl-[100px]">
              {ROW_2.map((c) => <ClientTile key={c.slug} client={c} reduce={reduce} />)}
            </DragMarquee>
          </div>
          {/* Row 3 */}
          <div className="flex-1 min-h-0 relative">
            <DragMarquee speed={38} gap={4} className="h-full items-stretch pl-[50px]">
              {ROW_3.map((c) => <ClientTile key={c.slug} client={c} reduce={reduce} />)}
            </DragMarquee>
          </div>
        </div>
`;

text = text.replace('        />\n      </div>', '        />\n' + marqueeHTML + '\n      </div>');

fs.writeFileSync('D:/rsecurity/src/components/Clients.tsx', text);
