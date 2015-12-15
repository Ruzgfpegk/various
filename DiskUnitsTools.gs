/* @Ruzgfpegk - 20151215 */
/* Perl-inspired notation: s_ for "scalars" (vars), a_ for "arrays". */
/* Intended to be used in Google Spreadsheets, via Tools/Script Editor. */

/**
 * Returns the size converted in any unit
 *
 * @param {string} input - The value to convert, including unit.
 * @param {string} unit - The output unit ('B', 'KB', 'MB', 'GB', 'TB').
 * @return The input converted to bytes.
 * @customfunction
 */

function UnitConvert(s_input, s_outunit) {
  s_input = s_input.toString(); // To make sure we can use ".replace".
  
  var a_pow    = { 'B':0, 'KB':1, 'MB':2, 'GB':3, 'TB':4 };
  var s_inunit = s_input.slice(-2);
  var s_number = parseFloat( s_input.replace(',','.') );
  var s_final  = 0;
  
  s_inunit = s_inunit.trim();
  
  if( a_pow.hasOwnProperty( s_inunit ) && a_pow.hasOwnProperty( s_outunit ) )
  { s_final = s_number*Math.pow( 1024, a_pow[s_inunit]-a_pow[s_outunit] ) }
  else
  { s_final = -1 }
  
  return s_final;
}

/**
 * Returns the size converted in bytes
 *
 * @param {string} input - The value to convert.
 * @return The input converted to bytes.
 * @customfunction
 */

function ToByte(s_input) {
  return UnitConvert(s_input, 'B');
}

/**
 * Returns the percentage of two sizes,
 * even if in different units.
 *
 * @param {string} total - The total size.
 * @param {string} used - The used size.
 * @return The input converted to bytes.
 * @customfunction
 */

function PercentOfSize(s_total, s_used) {
  var a_original = [s_total, s_used]; // In whatever format
  var a_final    = [];            // In bytes
  
  a_original.forEach(
    function(s_value) {
      a_final.push( ToByte(s_value) )
    });
  
  return a_final[1]/a_final[0];
}

/**
 * Returns the total of a list of sizes,
 * even if in different units.
 *
 * @param {(string|string[])} sizes - The list of sized to add.
 * @return The total of the sizes, in TB.
 * @customfunction
 */

function TotalOfSize(a_input) {  
  var s_total = 0;            // In bytes
  
  a_input.forEach(
    function(s_value) {
      var s_byte = ToByte(s_value);
      if( s_byte > 0 ) { s_total += s_byte }
    });
  
  s_total = UnitConvert(s_total + ' B', 'TB'); // Convert to the most convenient unit.
  s_total = s_total.toFixed(2);                // Keep only two decimals.
  s_total = s_total.toString() + ' TB';        // Convert to string and add the unit.
  s_total = s_total.replace('.',',');          // Replace . by , because spreadsheets...
  
  return s_total;
}
