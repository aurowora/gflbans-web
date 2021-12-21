/*
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
*/

/*
    Appends a forward slash to a string if it hasn't already got one
*/
function slash_fix(input: string): string
{
    if (input.endsWith('/'))
        return input;
    return input.endsWith('/') ? input : input + '/';
}

export {slash_fix};