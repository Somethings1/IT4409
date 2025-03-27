#include <iostream>
using namespace std;

int main() {
    int length, width;

    // Nhập độ dài và rộng của hình chữ nhật
    cin >> length >> width;

    // Tính chu vi và diện tích
    int perimeter = 2 * (length + width);  // Chu vi = 2 * (length + width)
    int area = length * width;             // Diện tích = length * width

    // In kết quả
    cout << perimeter << " " << area << endl;

    return 0;
}

