async function test() {
  const username = 'Venkat_c_m';
  const query = `
    query getMore($username: String!) {
      matchedUser(username: $username) {
        userCalendar {
          streak
          totalActiveDays
          submissionCalendar
        }
        tagProblemCounts {
          advanced { tagName tagSlug problemsSolved }
          intermediate { tagName tagSlug problemsSolved }
          fundamental { tagName tagSlug problemsSolved }
        }
        languageProblemCount {
          languageName
          problemsSolved
        }
      }
    }
  `;
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    body: JSON.stringify({ query, variables: { username } }),
  });
  const data = await res.json();
  console.log('userCalendar:', data.data?.matchedUser?.userCalendar);
  console.log('tagProblemCounts fundamental:', data.data?.matchedUser?.tagProblemCounts?.fundamental);
  console.log('tagProblemCounts intermediate:', data.data?.matchedUser?.tagProblemCounts?.intermediate);
  console.log('tagProblemCounts advanced:', data.data?.matchedUser?.tagProblemCounts?.advanced);
  console.log('languageProblemCount:', data.data?.matchedUser?.languageProblemCount);
}
test();
