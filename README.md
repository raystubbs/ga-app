# GA Mission Exercise
Unfortunately I didnt' quite get this to the point I wanted to in
the limited time.  But the basics are there.

```shell
$ npm install
$ npm start
```

Browser should open automatically, if not go to `http://localhost:3000`.

## Details
This project is mostly `create-react-app` setup boilerplate.  I didn't take the
time to go through and get rid of the bloat, and needed a good starting point
given the limited time for the project.

I did like zero with the styling beyond very very limited stuff to make the cards
at least readable/distinguishable.

The dataset is generated with faker.js, so can easily be adjusted (e.g number of records
can be changed or new fields added).

I didn't do a paging system, instead opting for lazy loading (i.e infinite-ish scroll).  New
records will be fetched and displayed (in batches of 5) as you scroll down.  Open
the terminal to see a log of records fetched so far.