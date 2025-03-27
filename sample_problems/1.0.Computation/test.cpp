#include <iostream>
#include <fstream>
#include <cstdlib>
#include <ctime>
#include <filesystem> // C++17
using namespace std;
namespace fs = std::__fs::filesystem;

void generateTests() {
    srand(time(0));

    // Ensure directories exist
    fs::create_directories("input");
    fs::create_directories("output");

    for (int t = 0; t < 10; ++t) {
        // Generate random values for a and b
        int a = rand() % 1000000000 + 1;  // 1 to 1e9
        int b = rand() % 1000000000 + 1;  // 1 to 1e9

        // Write input file
        string inputFileName = "input/input0" + to_string(t) + ".txt";
        ofstream inputFile(inputFileName);
        inputFile << a << " " << b << endl;
        inputFile.close();

        // Write output file
        string outputFileName = "output/output0" + to_string(t) + ".txt";
        ofstream outputFile(outputFileName);
        outputFile << a + b << endl;
        outputFile << a - b << endl;
        outputFile << (long long)a * b << endl;
        outputFile << a / b << endl;
        outputFile.close();
    }
}

int main() {
    generateTests();
    return 0;
}

