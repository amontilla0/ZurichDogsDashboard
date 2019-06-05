var sorted_breed_count = [];
var dogs_by_breed_and_year = [];

var dataCleaned = false;

d3.csv("assets/Zurich_dogs.csv", function(error, data) {
    // only select data in the period 2001-2015
    data = _.filter(data, r => {if (2001 <= r.DOG_BIRTH_YEAR && r.DOG_BIRTH_YEAR <= 2015) return r; })

    breed_count = _.chain(data)
                         .groupBy("BREED1")
                         .map((g, key) =>
                            {
                              return {breed: key, count: g.length };
                            }
                         ).value();

    sorted_breed_count = _.sortBy(breed_count, o => o.count).reverse();

    dogs_by_birth_year = _.chain(data)
                         .groupBy("DOG_BIRTH_YEAR")
                         .map((g, key) =>
                            {
                              return {year: key, count: g.length };
                            }
                         ).value();

     dogs_by_breed_and_year = _.chain(data)
                                    .groupBy("BREED1")
                                    .map((g, key) =>
                                       {
                                         return {breed: key, years:
                                           _.chain(g)
                                                .groupBy("DOG_BIRTH_YEAR")
                                                .map((g2, k2) =>
                                                   {
                                                     return {year: k2, count: g2.length };
                                                   }
                                                ).value()

                                         };
                                       }
                                    ).value();
    dataCleaned = true;
});
