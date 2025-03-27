#include <iostream>
#include <fstream>
#include <cstdlib>
#include <ctime>
#include <filesystem> // C++17
#include <iomanip>
using namespace std;
namespace fs = std::__fs::filesystem;

void generateTests() {
    srand(time(0));

    // Ensure directories exist
    fs::create_directories("input");
    fs::create_directories("output");

    for (int t = 0; t < 10; ++t) {
        // Generate random radius
        int r = rand() % 1000 + 1;  // Radius: 1 to 1000

        // Calculate circumference and area
        double pi = 3.14;
        double circumference = 2 * pi * r;
        double area = pi * r * r;

        // Write input file
        string inputFileName = "input/input0" + to_string(t) + ".txt";
        ofstream inputFile(inputFileName);
        inputFile << r << endl;
        inputFile.close();

        // Write output file
        string outputFileName = "output/output0" + to_string(t) + ".txt";
        ofstream outputFile(outputFileName);
        outputFile << fixed << setprecision(2) << circumference << endl;
        outputFile << fixed << setprecision(2) << area << endl;
        outputFile.close();
    }
}

int main() {
    generateTests();
    return 0;
}

