/**
 * The MIT License (MIT)
 *
 * Igor Zinken 2016-2020 - https://www.igorski.nl
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { ACTION_IDLE } from '@/model/types/audio-event-def';

/**
 * validates whether the song has any pattern content
 *
 * @param {SONG} song
 * @return {boolean}
 */
export const hasContent = song => {
    let hasContent = false;
    song.patterns.forEach(pattern => {
        pattern.channels.forEach(channel => {
            if (channel.find( event => event && event.action !== ACTION_IDLE )) {
                hasContent = true;
            }
        });
    });
    return hasContent;
};

/**
 * update the existing offsets for all of the Songs
 * audioEvents within its patterns
 *
 * @param {Array<PATTERN>} patterns the Songs patterns
 * @param {number} ratio by which to update the existing values
 */
export const updateEventOffsets = ( patterns, ratio ) => {
    // reverse looping for speed
    let i, j, k, songPattern, channel, pattern;

    i = patterns.length;
    while ( i-- ) {
        songPattern = patterns[ i ];
        j = songPattern.channels.length;

        while ( j-- ) {
            channel = songPattern.channels[ j ];
            k = channel.length;

            while ( k-- ) {
                pattern = channel[ k ];

                if ( pattern && pattern.seq ) {
                    const { seq } = pattern;
                    seq.startOffset        *= ratio;
                    seq.startMeasureOffset *= ratio;
                    seq.length             *= ratio;
                }
            }
        }
    }
};

/**
 * unset the play state of all of the songs events
 *
 * @param {Array<PATTERN>} patterns
 */
export const resetPlayState = patterns => {
    patterns.forEach(pattern => {
        pattern.channels.forEach(channel => {
            channel.forEach(event => {
                if ( event )
                    event.seq.playing = false;
            });
        });
    });
};
