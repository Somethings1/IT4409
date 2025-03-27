#include <iostream>
using namespace std;

int main() {
    double a, b, c;

    // Nhập vào hệ số a, b, c
    cin >> a >> b >> c;

    // Giải phương trình ax + b = c
    double x = (c - b) / a;  // Tính nghiệm

    // In ra nghiệm
    cout << x << endl;

    return 0;
}

