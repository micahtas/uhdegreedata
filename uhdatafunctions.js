/**
 * Analytics for UH dataset
 * Created by Micah on 9/28/2015.
 */

/* globals _ */
/* exported percentageHawaiian, totalDegreesByYear, listCampuses, listCampusDegrees, key, maxDegrees, doctoralDegreePrograms */

/**
 * Reduction function for accumulating the number of degrees.
 * @param memo the accumulator.
 * @param record the UH data from which award numbers in the data set.
 * @returns {*} the total of the accumulator and the awards in the record.
 */
function addDegrees(memo, record)
{
  if(isNaN(record["AWARDS"]))
  {
    throw new Error("Non-Numeric AWARDS.");
  }
  return memo + record["AWARDS"];
}

/**
 * Returns true if the passed record has an AWARDS field.
 * @param record the record.
 * @returns {boolean} true if AWARDS is present.
 */
function hasAwards(record)
{
  return record.hasOwnProperty("AWARDS");
}

/**
 * Function that returns the total number of degrees in the data set.
 * @param data is the data set of degree information.
 * @returns {*} total number of degrees.
 */
function totalDegrees(data)
{
  if(!_.every(data, hasAwards))
  {
    throw new Error("No AWARDS field.");
  }
  return _.reduce(data, addDegrees, 0);
}

/**
 * Predicate function returning true if the passed record concerns those of Hawaiian ancestry.
 * @param record the UH data set record.
 * @returns {boolean} true if concerns Hawaiian ancestry.
 */
function isHawaiian(record)
{
  return record["HAWAIIAN_LEGACY"] === "HAWAIIAN";
}

/**
 * Filters the data set to those records concerning Hawaiian ancestry.
 * @param data the UH data set.
 * @returns {Array.<T>|*} an array of records of those with Hawaiian ancestry.
 */
function hawaiianLegacy(data)
{
  return _.filter(data, isHawaiian);
}

/**
 * Returns the total number of degrees awarded to those of Hawaiian ancestry in data.
 * @param data the UH data set.
 * @returns {*} total number of degrees awarded to those of Hawaiian ancestry.
 */
function totalHawaiianLegacy(data)
{
  return _.reduce(hawaiianLegacy(data), addDegrees, 0);
}

/**
 * Returns the percentage of degrees awarded to those of Hawaiian ancestry in the data set.
 * @param data the UH data set.
 * @returns {number} percentage of degrees to Hawaiians.
 */
function percentageHawaiian(data)
{
  return (totalHawaiianLegacy(data) / totalDegrees(data)) * 100;
}

/**
 * Returns a predicate function that returns true if the passed record is from the given year.
 * @param year the year of interest.
 * @returns {Function} a function that returns true if the record is from the year.
 */
function filterYear(year)
{
  return function(record)
  {
    return record["FISCAL_YEAR"] === year;
  };
}

/**
 * Filters the data set to those records from that passed year.
 * @param data the UH data set.
 * @param year the year of interest.
 * @returns {Array.<T>|*} array of records from the given year.
 */
function findYear(data, year)
{
  return _.filter(data, filterYear(year));
}

/**
 * The total number of degrees awarded in a given year.
 * @param data the UH data set.
 * @param year the year of interest.
 * @returns {*} the total degrees for that yeae.
 */
function totalDegreesByYear(data, year)
{
  return _.reduce(findYear(data, year), addDegrees, 0);
}

/**
 * Returns campuses in the passed data set.
 * @param data the UH data set.
 * @returns {*} an array of string, one for each campus in the data set.
 */
function listCampuses(data)
{
  return _.uniq(_.pluck(data, "CAMPUS"));
}

/**
 * Groups the data set by campus.
 * @param data the UH data set.
 * @returns {*} an object that groups that data set by campus.
 */
function groupByCampus(data)
{
  return _.groupBy(data, "CAMPUS");
}

/**
 * Returns an object of key/value pairs. Keys are campues, values are the number of degrees awarded.
 * @param data the UH data set.
 * @returns {*} the degrees per campus.
 */
function listCampusDegrees(data)
{
  return _.mapObject(groupByCampus(data), function(val, key){
    return _.reduce(val, addDegrees, 0);
  });
}

/**
 * Groups the data set by year.
 * @param data the UH data set.
 * @returns {*} an object grouping the records in the data set by year.
 */
function groupByYear(data)
{
  return _.groupBy(data, "FISCAL_YEAR");
}

/**
 * Returns the maximum number of degrees awarded in a single year in the data set.
 * @param data the UH data set.
 * @returns {number} the maximum number of degees.
 */
function maxDegrees(data)
{
  return _.max(_.mapObject(groupByYear(data), function(val, key){
    return _.reduce(val, addDegrees, 0);
  }));
}

/**
 * Predicate function indicating if the passed record concerns a doctoral degree.
 * @param record the record of interest.
 * @returns {boolean} true if concerns a doctoral degree.
 */
function findDoctorals(record)
{
  return record["OUTCOME"] === "Doctoral Degrees";
}

/**
 * Filters the data into those that concern a doctoral degree.
 * @param data the UH data set.
 * @returns {Array.<T>|*} an array of records concerning a doctoral degree.
 */
function doctoralList(data)
{
  return _.filter(data, findDoctorals);
}

/**
 * Returns the list of programs with a doctoral degree.
 * @param data the UH data set.
 * @returns {*} a list of strings, one per program with a doctoral degree.
 */
function doctoralDegreePrograms(data)
{
  return _.uniq(_.pluck(doctoralList(data), "CIP_DESC"));
}
