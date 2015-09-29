/**
 * Analytics for UH dataset
 * Created by Micah on 9/28/2015.
 */

function addDegrees(memo, record)
{
  return memo + record["AWARDS"];
}

/** totalDegrees(data)
 *  function that can be passed uhdata and returns the total number of degrees awarded in the data set.
 */

function totalDegrees(data)
{
  return _.reduce(data, addDegrees, 0);
}

/** percentageHawaiian(data)
 * function that can be passed uhdata and returns the percentage of degrees that were awarded to students of Hawaiian Legacy in the data set.
 */

function isHawaiian(record)
{
  return record["HAWAIIAN_LEGACY"] === "HAWAIIAN";
}

function hawaiianLegacy(data)
{
  return _.filter(data, isHawaiian);
}

function totalHawaiianLegacy(data)
{
  return _.reduce(hawaiianLegacy(data), addDegrees, 0);
}

function percentageHawaiian(data)
{
  return (totalHawaiianLegacy(data) / totalDegrees(data)) * 100
}

/** totalDegreesByYear(data, year)
 *  function that can be passed uhdata and a year and returns the total number of degrees awarded in the passed year.
 */

function filterYear(year)
{
  return function(record)
  {
    return record["FISCAL_YEAR"] === year;
  };
}

function findYear(data, year)
{
  return _.filter(data, filterYear(year));
}

function totalDegreesByYear(data, year)
{
  return _.reduce(findYear(data, year), addDegrees, 0);
}

/** listCampuses(data)
 *  function that can be passed uhdata and returns an array containing all the campuses referenced in the passed data set.
 */

function listCampuses(data)
{
  return _.uniq(_.pluck(data, "CAMPUS"));
}

function groupByCampus(data)
{
  return _.groupBy(data, "CAMPUS");
}

/** listCampusDegrees(data)
 *  function that can be passed uhdata and returns an object where the property keys are campuses and the values are the number of degrees   *   awarded by the campus.
 */

function listCampusDegrees(data)
{
  return _.mapObject(groupByCampus(data), function(val, key){
    return _.reduce(val, addDegrees, 0);
  });
}

function groupByYear(data)
{
  return _.groupBy(data, "FISCAL_YEAR");
}

/** maxDegrees(data)
 *  function that can be passed uhdata and returns an integer indicating the maximum number of degrees awarded in a year.
 */

function maxDegrees(data)
{
  return _.max(_.mapObject(groupByYear(data), function(val, key){
    return _.reduce(val, addDegrees, 0);
  }));
}

/** doctoralDegreePrograms(data)
 *  function that can be passed uhdata and returns a list of degree programs ("CIP_DESC") for which a doctoral degree is awarded.
 */

function findDoctorals(record)
{
  return record["OUTCOME"] === "Doctoral Degrees";
}

function doctoralList(data)
{
  return _.filter(data, findDoctorals);
}

function doctoralDegreePrograms(data)
{
  return _.uniq(_.pluck(doctoralList(data), "CIP_DESC"));
}
