# Pentominoes Solver in JavaScript

## TL;DR

To run the program:

1. Start the server: ./serve.sh
   * This uses Python 3 to serve the page
   * This is the only place another language is used
   * You can use any other server you want to
2. Connect your browser to: http://localhost:8080
3. Open up the developer console on your browser the page
   * This is just so you can see the status and debug messages
4. Fiddle with the controls:
   * Start - To Start the web worker solving the pentominoes
   * Stop - To attemp to Stop the web worker (not always effective)
   * Explore to Depth - Indicate at what depth you'd like a status report (0 for debugging)
   * Debug - Check this to see many helpful debugging messages in the developer console
5. Press 'Start' and be patient :-)
6. You can change the board by editing the 'env.mjs' file:
   * 'testing' - This is a very simple two piece board for finding bugs in the algorithm
   * '6x10' - This is the standard Pentominoes board
   * 'withHole' - This is the standard Pentominoes with a hole board
   * '5x6' - This is a small 5x6 board that finds solutions right away
   * 'V' - This is the 'V' shaped board which contains no 'V' piece
   * '20x3' - This is the '20x3' shapeed board that's as narrow as can be
7. NOTE: After stopping the program you'll need to refresh the page to restart
8. NOTE: If you can't stop the program then you'll have to close the tab.


## History:

I've always been fascinated with computer algorithms, I mean: what other purpose could computers have? ;-)

In 1986 I wrote a pentominoes solver in Pascal which I ran on an IBM PC.  It ran, and ran and ran ...

I did a little arithmatic and found that it would take the life of our planet to find all the solutions. Not good.  I had used an exhaustive search technique that computed pieces on the board for every attempt.

So years later I found out about Donald Knuths Dancing Links (dlx) algorithm using a two dimensional linked list.  Things I got from there were:

1. The dancing links algorithm itself
2. Computing all the board locations up front
3. Choosing the next piece with the least number of board locations

And that takes me to this year (2020) where I finally took the time to write the program again.  There are other attempts that are the basis for the current code:

1. Elm was my first attempt - I don't know Elm (yet) and was dissapointed to find that creating a linked list wasn't a good fit for a functional program.  It didn't get very far.
2. Svelte - I used this to create the HTML/CSS board display code and again (accidently - really) re-implemented the exhaustive search technique
3. Node - I extracted the piece and board code and implemented the Knuth Dancing Links - Much harder than I thought it would be and I added lots of bugs for my own programming pleasure
4. JavaScript - I wanted to see what was going on with a new algorithm I designed (see below) and so took the Svelte bits and re-formed it into straight JavaScript to I could see what was happening

My new algorithm 'feels' good and looks like it would lend itself to functional programming, but I'm not sure, since it also seems much slower than Knuth's algorithm, which I don't understand either. :-)


## My New Algorithm:

I had a lovely epiphany regarding changing the two dimensional doubly linked lists into two arrays, so that's what this code represents.

First I finally kept noodling Knuths algorithm and finding other sources for it's solution online (ex: Wikipedia) and that boiled down to:

1. Given a matrix of all piece locations on the board:
   * We hide the column of the piece we're adding to the solution
   * We hide all the rows associated with column
   * We hide all the columns associated with those rows
2. So we're really just hiding rows and columns, do we really need all that fancy stuff in dlx?
   * I can just use two arrays, one for columns and one for rows.
   * Each column contains an array of all the rows that are associated to it
   * Each row contains an array of all the columns that are associated with it
3. While implementing this code I found:
   * I don't need to have a boolean flag for each row and column indicating it's being hidden
   * Instead I could just pass two additional simple arrays of hidden-columns and hidden-rows
   * And when I recurse the solve method, I just create new hidden row/column arrays with the additional hidden rows and columns respectively
   * That way when we drop out of the recursive method, then we automatically un-hide the hidden rows and columns
4. This all seems to work for 'testing', '5x7' and 'V', but I haven't gotten results yet for '6x10' or 'withHole' (and I'm not sure why). :-/


## Improvements:

1. Right now you have to edit 'env.mjs' to change the board to solve.  It would be cool if that could just be a drop down on the web page.
2. Right now it seems to take a long time to get solutions for '6x10' and 'withHole', so it would be nice to find out what's up with that.


## Random Notes:

The 'pieces' and 'pieceTools' code is all about manipulating the pieces so we can ultimately find all piece rotations on the board.

The 'board' is all about the shape of the board and what set of pieces go with it (ex: no 'V' piece in 'V' board).

The 'boardTools' is all about figuring out the valid locations of pieces on the board, and helping to create the matrix.

The 'newSolve' and 'solverTools' code is about helping to tie the callbacks with the 'NewDance' algorithm and speed ups that check the board for failed positions.

The 'callbacks' hash contain callback methods for various debuging routines and especially the 'solution' and 'status' methods that are used to draw on the screen.

If you do choose to use the 'Debug' checkbox a LOT of information is produced.  I recommend using Command-a to select it all, and 'pbpaste > foo.txt' to dump it into a file.


## Final Note:

This Pentominoes puzzle has been my White Whale for a long time, and I've found that it's given me a lot of pleasure.  I hope it brings you pleasure too.  Happy Coding!


## Images:

![Starting screen](/images/starting.png)

![Solution](/images/solution.png)

![Debugging](/images/debugging.png)


