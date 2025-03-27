#include <iostream>
using namespace std;

int main() {
    char ch;

    // Nhập vào một ký tự
    cin >> ch;

    // Tính ký tự tiếp theo
    char next_ch = (ch == 'z') ? 'a' : ch + 1;

    // In ra ký tự tiếp theo
    cout << next_ch << endl;

    return 0;
}

