/* globals _, uhdata, totalDegrees, isHawaiian */

describe("TotalDegrees", function() {
  var testData = uhdata.slice(0, 2).concat(_.find(uhdata, isHawaiian));

  it("should compute the total number of awards for correctly specified sample data", function() {
    expect(totalDegrees(testData)).toEqual(403);
  });

  var noAwardsField = testData.concat({foo: "bar"});

  it("should throw an error when a record does not have the AWARDS field", function() {
    expect(function(){totalDegrees(noAwardsField);}).toThrowError("No AWARDS field.");
  });

  var nonNumericAwards = testData.concat({"AWARDS": "bar"});

  it("should throw an error when a record has a non numeric AWARDS field", function() {
    expect(function(){totalDegrees(nonNumericAwards);}).toThrowError("Non-Numeric AWARDS.");
  });
});
