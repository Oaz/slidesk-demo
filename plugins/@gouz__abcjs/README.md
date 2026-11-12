# SliDesk Plugin: ABCJS

With this plugin you can generate abcjs music sheet in your presentation, and play it

Use a `<textarea data-abc>` in your slide, the text content will be the music sheet.

More information for the notation on: https://abcnotation.com/wiki/abc:standard:v2.1

```
<textarea data-abc>
X:1
M:4/4
L:1/16
Q:1/4=88
V:1 clef=treble
z2 E'2 D'3C' D'C'D'C' D'2D'C' | D'C'D'C' D'2E'(C' C'4) z4 |]
w: To- day is gon- na be the day that they' re gon-na throw it back to you
%%staves {2 3}
K:Am
V:2 clef=treble
[ACE]4 [ACE]4  [CEG]4 [CEG]4 | [B,DG]4 [B,DG]4  [D^FA]4 [D^FA]4 |]
V:3 clef=bass
[A,,E,]6 [A,,E,]2  [C,G,]6 [C,G,]2 | [G,,D,]6 [G,,D,]2  D,6 D,2 |]
w: i _  bIII _ | bVII _  IV _
</textarea>
```
