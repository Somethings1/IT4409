#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int r;
    cin >> r;

    const double pi = 3.14;
    double circumference = 2 * pi * r;
    double area = pi * r * r;

    cout << fixed << setprecision(2) << circumference << endl;
    cout << fixed << setprecision(2) << area << endl;

    return 0;
}

