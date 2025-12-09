---
title: How computers generate random numbers
description: Random numbers are not that random, or are they?
pubDatetime: 2021-05-18T12:00:00.0000
slug: how-computers-generate-random-numbers
featured: true
tags: ["software"]
---

We have all used `.random()` function in our programming journey, which returned us some random number in some specified range. Did you ever think how the random number was generated?

You'll agree that, 
>"A computer is a machine that can be programmed to carry out sequences of arithmetic or logical operations automatically."
  \- _[Wikipedia](https://en.wikipedia.org/wiki/Computer)_

Then how can a computer be programmed to generate a random number through sequence of operations? If some random number is generated through some sequence of steps (algorithm), is it truly random? This takes us to the types of random numbers there are:
1. True Random Numbers
2. Pseudo Random Numbers

---

#1. True Random Numbers:
As the name suggests, they are truly random. Since an algorithmically generated number can't be a random number in true sense, true random numbers are generated using unpredictable data from real world, like the rpm (rotations per minute) of CPU fan, or exact time you press a key on your keyboard, or atmospheric noise around the computer. Such physical phenomenon give completely unpredictable set of entropy (randomness), making true random numbers secure. 

Random number generators of this kind are called True random number generators (TRNGs). Linux uses [dev/random](https://en.wikipedia.org/wiki//dev/random) to collect _entropy_ from atmosphere around you, and creates true random numbers. It gathers _entropy_ in form of environmental noise through device drivers.

---

#2. Pseudo Random Numbers:
These are alternative to true random numbers, generated using some seed value and some algorithm. The numbers generated seem to be random, but are predictable in reality if seed value and algorithm is known.

As you might have already guessed, they are not great from security perspective. This is why using PRNGs in encryption is a bad idea. FreeBSD takes it [rather seriously](https://arstechnica.com/information-technology/2013/12/we-cannot-trust-intel-and-vias-chip-based-crypto-freebsd-developers-say/).

Random number generators generating these kinds of numbers are called pseudo random number generators (PRNGs). PRNGs are faster compared to TRNGs, and are useful in scenarios where security is not a concern, like games, or while learning programming.

---

One of the most common PRNG is [linear congruential generator](https://en.wikipedia.org/wiki/Linear_congruential_generator). Let's see how it works.

It uses recurrence:

<var>X<sub>n+1</sub> = (aX<sub>n</sub> + b) mod m</var>

Where,
X is sequence of pseudo random values
m is the modulus
a the multiplier
c the increment
X<sub>0</sub> the seed value

Let's have an example. Taking X<sub>0</sub> as 10,
a = 22,
c = 723,
m = 10,000

X<sub>1</sub> = (aX<sub>0</sub> + c) mod m
X<sub>1</sub> = ( 22(10) + 723 )mod 10000
X<sub>1</sub> = 943

Now to get another random number X<sub>2</sub>, put value of X<sub>1</sub> from above,

X<sub>2</sub> = (aX<sub>1</sub> + c) mod m
X<sub>2</sub> = ( 22(943) + 743 )mod 10000
X<sub>2</sub> = 1489

This is one of the numerous ways how you can generate different (pseudo) random numbers of different sizes.

---

Javascript [code](https://www.geeksforgeeks.org/linear-congruence-method-for-generating-pseudo-random-numbers/) for Linear Congruence method:

```javascript
// Function to generate random numbers
function linearCongruentialMethod(Xo, m,  a, c,
                     randomNums, noOfRandomNums)
{
       
    // Initialize the seed state
    randomNums[0] = Xo;
   
    // Traverse to generate required
    // numbers of random numbers
    for(let i = 1; i < noOfRandomNums; i++)
    {
           
        // Follow the linear congruential method
        randomNums[i] = ((randomNums[i - 1] * a) + c) % m;
    }
}
 
    // Driver Code
         
    // Seed value
    let Xo = 5;   
    // Modulus parameter
    let m = 7;
    // Multiplier term
    let a = 3; 
    // Increment term
    let c = 3; 
    // Number of Random numbers
    // to be generated
    let noOfRandomNums = 10;
       
    // To store random numbers
    let randomNums = new Array(noOfRandomNums).fill(0);
       
    // Function Call
    linearCongruentialMethod(Xo, m, a, c,
                             randomNums,
                             noOfRandomNums);
       
    for(let i = 0; i < noOfRandomNums; i++)
    {
        document.write(randomNums[i] + " ");
    }

Credits: Geeksforgeeks
```

